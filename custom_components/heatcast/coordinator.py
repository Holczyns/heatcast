"""Scan loop: reads inputs, runs the model, writes the boiler and radiator valves.

One scan every 30 s. Every 5 min the scan also advances the model state
(filters, damping, integral) and every 30 min it refreshes the forecast
first. The coordinator is the only writer of the boiler entities and
of the radiator valves configured in rooms.

State kept across restarts (Store): tuning parameters, room weights and
targets, room synchronisation, model state, control switch and heating
on/off.
"""

from __future__ import annotations

import logging
from dataclasses import fields
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID, ATTR_TEMPERATURE, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_call_later, async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.helpers.sun import get_astral_event_next
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    CONF_BLOCK_ENTITY,
    CONF_FLOW_ENTITY,
    CONF_IDLE_FLOW,
    CONF_INDIVIDUAL_ROOMS,
    CONF_OUTDOOR_SENSOR,
    CONF_PARAMS,
    CONF_SCHEDULE,
    CONF_SENSOR,
    CONF_TARGET,
    CONF_VALVE,
    CONF_VALVE_TEMPERATURE,
    CONF_WEATHER,
    CONF_WEIGHT,
    DEFAULT_TEST_FLOW,
    DEFAULT_WEIGHT,
    DOMAIN,
    FORECAST_MINUTES,
    SCAN_SECONDS,
    STEP_MINUTES,
    STORAGE_VERSION,
    SUBENTRY_ROOM,
    TEST_MODE_MINUTES,
)
from .engine import (
    RELEASE,
    ForecastHour,
    Inputs,
    Model,
    ModelState,
    OutputCommand,
    Params,
    RoomConfig,
    RoomReading,
    Snapshot,
    decide_output,
    summarize_forecast,
)

_LOGGER = logging.getLogger(__name__)

PARAM_KEYS = tuple(field.name for field in fields(Params))
MISSING_STATES = (STATE_UNAVAILABLE, STATE_UNKNOWN)
# Valve writes are skipped for differences below this (K).
VALVE_TOLERANCE = 0.05
VALVE_SENSOR_TOLERANCE = 0.1


def _number(state_value: str | None) -> float | None:
    try:
        return float(state_value)
    except (TypeError, ValueError):
        return None


class HeatCastCoordinator(DataUpdateCoordinator[Snapshot]):
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, _LOGGER, config_entry=entry, name=DOMAIN, update_interval=None)
        self.entry = entry
        self.device_id: str | None = None
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}")
        self.params: dict[str, float] = {}
        self.room_tuning: dict[str, dict[str, float]] = {}
        self.control_active = False
        self.heating_enabled = True
        self.rooms_synchronised = True
        self.test_mode = False
        self.test_flow = DEFAULT_TEST_FLOW
        self.model = Model(Params(), [])
        self._unsub: list[CALLBACK_TYPE] = []
        self._test_timer: CALLBACK_TYPE | None = None
        # When an entity that does not exist (yet) was first looked up; kept until it appears.
        self._absent_since: dict[str, datetime] = {}

    # Configuration views

    @property
    def eco_shift(self) -> float:
        """Setback in force right now, read back from the last evaluation."""
        return self.data.setpoint - self.params["comfort_temp"]

    @property
    def options(self) -> dict[str, Any]:
        return dict(self.entry.data)

    @property
    def individual_rooms(self) -> bool:
        return self.entry.options.get(CONF_INDIVIDUAL_ROOMS, False)

    @property
    def rooms(self) -> dict[str, Any]:
        """Room subentries keyed by subentry id (the stable room key)."""
        return {
            subentry_id: subentry
            for subentry_id, subentry in self.entry.subentries.items()
            if subentry.subentry_type == SUBENTRY_ROOM
        }

    # Lifecycle

    async def async_setup(self) -> None:
        stored = await self._store.async_load() or {}
        self.params = {field.name: getattr(Params(), field.name) for field in fields(Params)}
        self.params.update(self.entry.data.get(CONF_PARAMS, {}))
        self.params.update({key: value for key, value in stored.get("params", {}).items() if key in PARAM_KEYS})
        self.control_active = stored.get("control_active", False)
        self.heating_enabled = stored.get("heating_enabled", True)
        self.rooms_synchronised = stored.get("rooms_synchronised", True)
        self.test_flow = stored.get("test_flow", DEFAULT_TEST_FLOW)

        stored_tuning = stored.get("rooms", {})
        for room_key, subentry in self.rooms.items():
            tuning = stored_tuning.get(room_key, {})
            self.room_tuning[room_key] = {
                CONF_WEIGHT: tuning.get(CONF_WEIGHT, subentry.data.get(CONF_WEIGHT, DEFAULT_WEIGHT)),
                CONF_TARGET: tuning.get(CONF_TARGET, self.params["comfort_temp"]),
            }

        state = ModelState.from_dict(stored["model"]) if "model" in stored else ModelState()
        # A removed room must not leave its filter behind.
        state.filtered = {key: value for key, value in state.filtered.items() if key in self.rooms}
        self.model = Model(self._params(), self._room_configs(), state)

        now = dt_util.now()
        # The weather integration may still be starting; do not hold up Home Assistant for it.
        self.entry.async_create_background_task(
            self.hass, self._async_refresh_forecast(now), name=f"{DOMAIN} first forecast"
        )
        inputs = self._read_inputs(now)
        self.model.prime(inputs)
        self.async_set_updated_data(self.model.evaluate(inputs, now))

        self._unsub.append(async_track_time_change(self.hass, self._async_scan, second=list(SCAN_SECONDS)))

    async def async_shutdown(self) -> None:
        for unsub in self._unsub:
            unsub()
        self._unsub.clear()
        self._cancel_test_timer()
        await self._async_save()
        await super().async_shutdown()

    async def _async_save(self) -> None:
        await self._store.async_save(self._save_data())

    @callback
    def _schedule_save(self) -> None:
        self._store.async_delay_save(self._save_data, 10)

    def _save_data(self) -> dict[str, Any]:
        return {
            "params": dict(self.params),
            "rooms": {key: dict(value) for key, value in self.room_tuning.items()},
            "model": self.model.state.as_dict(),
            "control_active": self.control_active,
            "heating_enabled": self.heating_enabled,
            "rooms_synchronised": self.rooms_synchronised,
            "test_flow": self.test_flow,
        }

    # Model inputs

    def _params(self) -> Params:
        return Params(**{key: float(self.params[key]) for key in PARAM_KEYS if key in self.params})

    def _room_configs(self) -> list[RoomConfig]:
        return [
            RoomConfig(key, weight=self.room_tuning[key][CONF_WEIGHT], target=self.room_tuning[key][CONF_TARGET])
            for key in self.rooms
        ]

    def _reading(self, entity_id: str, now: datetime) -> RoomReading:
        state = self.hass.states.get(entity_id)
        # During startup the sensor's integration may not have created the entity yet;
        # that counts as a dropout, so the room keeps its last value for the hold time.
        if state is None:
            absent_since = self._absent_since.setdefault(entity_id, now)
            return RoomReading(value=None, age_s=None, missing_s=(now - absent_since).total_seconds())
        self._absent_since.pop(entity_id, None)
        missing_s = None
        if state.state in MISSING_STATES:
            missing_s = (now - state.last_changed).total_seconds()
        # last_reported moves on every report, last_updated only when the value changes.
        age_s = (now - state.last_reported).total_seconds()
        return RoomReading(value=_number(state.state), age_s=age_s, missing_s=missing_s)

    def _read_inputs(self, now: datetime) -> Inputs:
        options = self.options
        outdoor_state = self.hass.states.get(options[CONF_OUTDOOR_SENSOR])
        schedule = options.get(CONF_SCHEDULE)
        comfort_active = True
        if schedule:
            comfort_active = self.hass.states.is_state(schedule, STATE_ON)
        return Inputs(
            readings={key: self._reading(room.data[CONF_SENSOR], now) for key, room in self.rooms.items()},
            outdoor=_number(outdoor_state.state) if outdoor_state else None,
            comfort_active=comfort_active,
            enabled=self.heating_enabled,
            # Without the option every room follows the house setpoint.
            synchronised=self.rooms_synchronised or not self.individual_rooms,
        )

    async def _async_refresh_forecast(self, now: datetime) -> None:
        weather = self.options.get(CONF_WEATHER)
        if not weather:
            return
        try:
            response = await self.hass.services.async_call(
                "weather",
                "get_forecasts",
                {ATTR_ENTITY_ID: weather, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
        except HomeAssistantError as err:
            _LOGGER.debug("Forecast from %s not available: %s", weather, err)
            return

        hours = []
        for entry in (response or {}).get(weather, {}).get("forecast", []):
            start = dt_util.parse_datetime(entry.get("datetime", ""))
            if start is None:
                continue
            hours.append(
                ForecastHour(
                    start=start,
                    temperature=entry.get("temperature"),
                    cloud_coverage=entry.get("cloud_coverage"),
                    wind_speed=entry.get("wind_speed"),
                )
            )
        utc_now = dt_util.as_utc(now)
        summary = summarize_forecast(
            hours,
            now,
            int(self.params["forecast_horizon_h"]),
            get_astral_event_next(self.hass, "sunrise", utc_now),
            get_astral_event_next(self.hass, "sunset", utc_now),
        )
        self.model.set_forecast(summary)

    # Scan

    async def _async_scan(self, now: datetime) -> None:
        is_step = (now.minute % STEP_MINUTES == 0) and (now.second == SCAN_SECONDS[0])
        is_forecast = is_step and (now.minute % FORECAST_MINUTES == 0)

        if is_forecast:
            await self._async_refresh_forecast(now)

        self.model.params = self._params()
        self.model.rooms = self._room_configs()
        inputs = self._read_inputs(now)
        if is_step:
            snapshot = self.model.step(inputs, now)
        else:
            snapshot = self.model.evaluate(inputs, now)

        await self._async_write_boiler(snapshot)
        if is_step:
            await self._async_write_valves(snapshot, inputs)
            self._schedule_save()
        self.async_set_updated_data(snapshot)

    @callback
    def async_refresh_snapshot(self) -> None:
        """Re-evaluate after a setting changed, without advancing the state."""
        now = dt_util.now()
        self.model.params = self._params()
        self.model.rooms = self._room_configs()
        self.async_set_updated_data(self.model.evaluate(self._read_inputs(now), now))
        self._schedule_save()

    # Outputs

    async def _async_write_boiler(self, snapshot: Snapshot) -> None:
        options = self.options
        block_entity = options.get(CONF_BLOCK_ENTITY)
        command = decide_output(
            control_active=self.control_active,
            test_mode=self.test_mode,
            test_flow=round(self.test_flow),
            demand=snapshot.demand,
            flow=snapshot.flow,
            has_block_switch=bool(block_entity),
            idle_flow=round(options.get(CONF_IDLE_FLOW, 0)),
        )
        await self._async_send(command)

    async def _async_send(self, command: OutputCommand) -> None:
        options = self.options
        block_entity = options.get(CONF_BLOCK_ENTITY)
        if (command.block_heating is not None) and block_entity:
            await self._async_set_block(block_entity, command.block_heating)
        if command.flow is not None:
            flow_entity = options[CONF_FLOW_ENTITY]
            await self._async_call(
                flow_entity.split(".")[0], "set_value", {ATTR_ENTITY_ID: flow_entity, "value": command.flow}
            )

    async def _async_set_block(self, entity_id: str, block: bool) -> None:
        """The heating-off switch is written only when its state differs."""
        desired = STATE_ON if block else "off"
        state = self.hass.states.get(entity_id)
        if (state is not None) and (state.state == desired):
            return
        service = "turn_on" if block else "turn_off"
        await self._async_call(entity_id.split(".")[0], service, {ATTR_ENTITY_ID: entity_id})

    async def _async_write_valves(self, snapshot: Snapshot, inputs: Inputs) -> None:
        """Radiator valves follow their room target; written on 5-min steps only."""
        if not self.control_active:
            return
        for key, room in self.rooms.items():
            valve = room.data.get(CONF_VALVE)
            target = snapshot.room_targets.get(key)
            if valve and (target is not None):
                await self._async_write_valve_target(valve, target)
            valve_temperature = room.data.get(CONF_VALVE_TEMPERATURE)
            reading = inputs.readings.get(key)
            if valve_temperature and (reading is not None) and (reading.value is not None):
                await self._async_write_valve_temperature(valve_temperature, reading.value)

    async def _async_write_valve_target(self, valve: str, target: float) -> None:
        state = self.hass.states.get(valve)
        if (state is None) or (state.state in MISSING_STATES):
            return
        current = _number(state.attributes.get(ATTR_TEMPERATURE))
        target_reached = (current is not None) and (abs(current - target) < VALVE_TOLERANCE)
        if target_reached:
            return
        await self._async_call("climate", "set_temperature", {ATTR_ENTITY_ID: valve, ATTR_TEMPERATURE: target})

    async def _async_write_valve_temperature(self, entity_id: str, value: float) -> None:
        state = self.hass.states.get(entity_id)
        if (state is None) or (state.state in MISSING_STATES):
            return
        current = _number(state.state)
        unchanged = (current is not None) and (abs(current - value) < VALVE_SENSOR_TOLERANCE)
        if unchanged:
            return
        await self._async_call(
            entity_id.split(".")[0], "set_value", {ATTR_ENTITY_ID: entity_id, "value": round(value, 1)}
        )

    async def _async_call(self, domain: str, service: str, data: dict[str, Any]) -> None:
        try:
            await self.hass.services.async_call(domain, service, data, blocking=True)
        except HomeAssistantError as err:
            _LOGGER.warning("Writing %s.%s to %s failed: %s", domain, service, data.get(ATTR_ENTITY_ID), err)

    # Settings changed from entities

    async def async_set_control(self, active: bool) -> None:
        was_active = self.control_active
        self.control_active = active
        self._schedule_save()
        # Hand the boiler back: lift the heating block so it can run on its own curve.
        if was_active and not active:
            await self._async_send(RELEASE)
        self.async_update_listeners()

    async def async_set_test_mode(self, active: bool) -> None:
        self.test_mode = active
        self._cancel_test_timer()
        if active:
            self._test_timer = async_call_later(
                self.hass, timedelta(minutes=TEST_MODE_MINUTES), self._async_test_timeout
            )
        self.async_update_listeners()

    async def _async_test_timeout(self, _now: datetime) -> None:
        self._test_timer = None
        await self.async_set_test_mode(False)

    def _cancel_test_timer(self) -> None:
        if self._test_timer is not None:
            self._test_timer()
            self._test_timer = None

    @callback
    def async_set_heating_enabled(self, enabled: bool) -> None:
        self.heating_enabled = enabled
        self.async_refresh_snapshot()

    @callback
    def async_set_rooms_synchronised(self, synchronised: bool) -> None:
        # Leaving sync starts every room from the house value, as in a car climate unit.
        if self.rooms_synchronised and not synchronised:
            for tuning in self.room_tuning.values():
                tuning[CONF_TARGET] = self.params["comfort_temp"]
        self.rooms_synchronised = synchronised
        self.async_refresh_snapshot()

    @callback
    def async_set_room_target(self, room_key: str, comfort_target: float) -> None:
        """Setting one room while synchronised switches all rooms to individual targets."""
        self.async_set_rooms_synchronised(False)
        self.room_tuning[room_key][CONF_TARGET] = comfort_target
        self.async_refresh_snapshot()

    @callback
    def async_set_param(self, key: str, value: float) -> None:
        self.params[key] = value
        self.async_refresh_snapshot()

    @callback
    def async_set_room_tuning(self, room_key: str, key: str, value: float) -> None:
        self.room_tuning[room_key][key] = value
        self.async_refresh_snapshot()

    @callback
    def async_set_state_value(self, key: str, value: float) -> None:
        """Seed integral or damped outdoor temperature by hand."""
        if key == "integral":
            self.model.state.integral = value
        if key == "outdoor_damped":
            self.model.state.damped = value
        self.async_refresh_snapshot()

    @callback
    def async_set_test_flow(self, value: float) -> None:
        self.test_flow = value
        self._schedule_save()
        self.async_update_listeners()
