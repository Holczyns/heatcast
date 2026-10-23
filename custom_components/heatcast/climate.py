"""Thermostats: the house (main) and one per room.

Temperatures set here are the values in force right now. Outside the
comfort schedule the eco setback is already included, so it is removed
again before the comfort value is stored.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import ClimateEntity, ClimateEntityFeature, HVACAction, HVACMode
from homeassistant.config_entries import ConfigSubentry
from homeassistant.const import ATTR_TEMPERATURE, STATE_ON, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HeatCastConfigEntry
from .const import CONF_FLAME_SENSOR, CONF_SENSOR
from .coordinator import HeatCastCoordinator
from .entity import HeatCastEntity, HeatCastRoomEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HeatCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities([HouseClimate(coordinator, "thermostat")])
    if not coordinator.individual_rooms:
        return
    for room in coordinator.rooms.values():
        async_add_entities([RoomClimate(coordinator, room, "thermostat")], config_subentry_id=room.subentry_id)


class _ThermostatBase(ClimateEntity):
    coordinator: HeatCastCoordinator

    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    _attr_min_temp = 5
    _attr_max_temp = 30

    def _heating_now(self) -> bool:
        snapshot = self.coordinator.data
        heating = snapshot.demand and bool(snapshot.flow)
        flame_sensor = self.coordinator.options.get(CONF_FLAME_SENSOR)
        if flame_sensor:
            heating = self.hass.states.is_state(flame_sensor, STATE_ON)
        return heating

    @property
    def hvac_action(self) -> HVACAction:
        if not self.coordinator.heating_enabled:
            return HVACAction.OFF
        if self._heating_now():
            return HVACAction.HEATING
        return HVACAction.IDLE


class HouseClimate(HeatCastEntity, _ThermostatBase):
    """Off means no heating demand: the boiler is blocked when control is on."""

    _attr_name = None
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE | ClimateEntityFeature.TURN_ON | ClimateEntityFeature.TURN_OFF
    )

    @property
    def current_temperature(self) -> float | None:
        return self.coordinator.data.room.temperature

    @property
    def target_temperature(self) -> float:
        return self.coordinator.data.setpoint

    @property
    def hvac_mode(self) -> HVACMode:
        if self.coordinator.heating_enabled:
            return HVACMode.HEAT
        return HVACMode.OFF

    async def async_set_temperature(self, **kwargs: Any) -> None:
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return
        self.coordinator.async_set_param("comfort_temp", float(temperature) - self.coordinator.eco_shift)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        self.coordinator.async_set_heating_enabled(hvac_mode == HVACMode.HEAT)


class RoomClimate(HeatCastRoomEntity, _ThermostatBase):
    """Room target; changing it while rooms are synchronised switches to individual targets."""

    _attr_name = None
    _attr_hvac_modes = [HVACMode.HEAT]
    _attr_hvac_mode = HVACMode.HEAT
    _attr_supported_features = ClimateEntityFeature.TARGET_TEMPERATURE

    def __init__(self, coordinator: HeatCastCoordinator, room: ConfigSubentry, key: str) -> None:
        super().__init__(coordinator, room, key)
        # Named after the room device alone, giving climate.<room>.
        self._attr_translation_key = None
        self._sensor = room.data[CONF_SENSOR]

    @property
    def current_temperature(self) -> float | None:
        state = self.hass.states.get(self._sensor)
        if state is None:
            return None
        try:
            return float(state.state)
        except ValueError:
            return None

    @property
    def target_temperature(self) -> float | None:
        return self.coordinator.data.room_targets.get(self.room_key)

    async def async_set_temperature(self, **kwargs: Any) -> None:
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return
        self.coordinator.async_set_room_target(self.room_key, float(temperature) - self.coordinator.eco_shift)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Rooms always heat; a room is left out of control by setting its weight to 0."""
