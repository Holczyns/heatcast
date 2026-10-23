"""Setup wizard: boiler, weather, heating curve and rooms."""

from __future__ import annotations

from typing import Any, override

import probatio
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryData,
    ConfigSubentryFlow,
    SubentryFlowResult,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_BLOCK_ENTITY,
    CONF_DHW_SENSOR,
    CONF_FLAME_SENSOR,
    CONF_FLOW_ENTITY,
    CONF_FLOW_SENSOR,
    CONF_HEATING_TYPE,
    CONF_IDLE_FLOW,
    CONF_OUTDOOR_SENSOR,
    CONF_PARAMS,
    CONF_SCHEDULE,
    CONF_SENSOR,
    CONF_VALVE,
    CONF_VALVE_TEMPERATURE,
    CONF_WEATHER,
    CONF_WEIGHT,
    CURVE_KEYS,
    CURVE_PRESETS,
    DEFAULT_NAME,
    DEFAULT_WEIGHT,
    DOMAIN,
    HEATING_MIXED,
    SUBENTRY_ROOM,
)
from .engine import Params
from .engine.control import curve_flow

PREVIEW_SETPOINT = 20.0
PREVIEW_OUTDOOR = (15.0, 10.0, 5.0, 0.0, -10.0)


def _entity(domain: str | list[str], device_class: str | None = None) -> EntitySelector:
    entity_filter: dict[str, Any] = {"domain": domain}
    if device_class is not None:
        entity_filter["device_class"] = device_class
    return EntitySelector(EntitySelectorConfig(filter=entity_filter))


def _number(minimum: float, maximum: float, step: float, unit: str | None = None) -> NumberSelector:
    config = NumberSelectorConfig(min=minimum, max=maximum, step=step, mode=NumberSelectorMode.BOX)
    if unit is not None:
        config["unit_of_measurement"] = unit
    return NumberSelector(config)


def _optional(key: str, defaults: dict[str, Any]) -> probatio.Optional:
    """Optional field that keeps a previously chosen entity as suggestion."""
    value = defaults.get(key)
    if value is None:
        return probatio.Optional(key)
    return probatio.Optional(key, description={"suggested_value": value})


BOILER_SCHEMA_KEYS = (
    CONF_FLOW_ENTITY,
    CONF_BLOCK_ENTITY,
    CONF_IDLE_FLOW,
    CONF_FLOW_SENSOR,
    CONF_FLAME_SENSOR,
    CONF_DHW_SENSOR,
)


def boiler_schema(defaults: dict[str, Any]) -> probatio.Schema:
    return probatio.Schema(
        {
            probatio.Required(CONF_FLOW_ENTITY, default=defaults.get(CONF_FLOW_ENTITY, probatio.UNDEFINED)): _entity(
                ["number", "input_number"]
            ),
            _optional(CONF_BLOCK_ENTITY, defaults): _entity(["switch", "input_boolean"]),
            probatio.Required(CONF_IDLE_FLOW, default=defaults.get(CONF_IDLE_FLOW, 0)): _number(0, 40, 1, "°C"),
            _optional(CONF_FLOW_SENSOR, defaults): _entity("sensor", "temperature"),
            _optional(CONF_FLAME_SENSOR, defaults): _entity("binary_sensor"),
            _optional(CONF_DHW_SENSOR, defaults): _entity("binary_sensor"),
        }
    )


def climate_schema(defaults: dict[str, Any]) -> probatio.Schema:
    return probatio.Schema(
        {
            probatio.Required(
                CONF_OUTDOOR_SENSOR, default=defaults.get(CONF_OUTDOOR_SENSOR, probatio.UNDEFINED)
            ): _entity("sensor", "temperature"),
            _optional(CONF_WEATHER, defaults): _entity("weather"),
            _optional(CONF_SCHEDULE, defaults): _entity("schedule"),
        }
    )


def curve_schema(values: dict[str, float]) -> probatio.Schema:
    return probatio.Schema(
        {
            probatio.Required("design_temp", default=values["design_temp"]): _number(20, 80, 1, "°C"),
            probatio.Required("outdoor_min", default=values["outdoor_min"]): _number(-40, 0, 1, "°C"),
            probatio.Required("curve_exponent", default=values["curve_exponent"]): _number(1, 2, 0.05),
            probatio.Required("curve_offset", default=values["curve_offset"]): _number(-10, 10, 0.5, "K"),
            probatio.Required("flow_min", default=values["flow_min"]): _number(10, 40, 1, "°C"),
            probatio.Required("flow_max", default=values["flow_max"]): _number(25, 85, 1, "°C"),
            probatio.Required("summer_temp", default=values["summer_temp"]): _number(5, 25, 0.5, "°C"),
        }
    )


def room_schema(defaults: dict[str, Any], with_tuning: bool) -> probatio.Schema:
    fields: dict[Any, Any] = {
        probatio.Required(CONF_NAME, default=defaults.get(CONF_NAME, probatio.UNDEFINED)): TextSelector(),
        probatio.Required(CONF_SENSOR, default=defaults.get(CONF_SENSOR, probatio.UNDEFINED)): _entity(
            "sensor", "temperature"
        ),
    }
    if with_tuning:
        fields[probatio.Required(CONF_WEIGHT, default=defaults.get(CONF_WEIGHT, DEFAULT_WEIGHT))] = _number(0, 1, 0.05)
    fields[_optional(CONF_VALVE, defaults)] = _entity("climate")
    fields[_optional(CONF_VALVE_TEMPERATURE, defaults)] = _entity(["number", "input_number"])
    return probatio.Schema(fields)


def curve_preview(values: dict[str, float]) -> str:
    """Markdown table of flow temperatures for a few outdoor temperatures."""
    params = Params(**{key: float(values[key]) for key in CURVE_KEYS})
    rows = ["| °C | °C |", "|---:|---:|"]
    for outdoor in PREVIEW_OUTDOOR:
        curve = curve_flow(PREVIEW_SETPOINT, outdoor, params)
        flow = max(min(curve, params.flow_max), params.flow_min)
        rows.append(f"| {outdoor:g} | {flow:.0f} |")
    return "\n".join(rows)


def _room_subentry(room: dict[str, Any]) -> ConfigSubentryData:
    data = {key: value for key, value in room.items() if key != CONF_NAME}
    return ConfigSubentryData(data=data, subentry_type=SUBENTRY_ROOM, title=room[CONF_NAME], unique_id=None)


class HeatCastConfigFlow(ConfigFlow, domain=DOMAIN):
    """Guided setup; rooms collected here become subentries of the entry."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._curve: dict[str, float] = {}
        self._rooms: list[dict[str, Any]] = []

    @classmethod
    @callback
    @override
    def async_get_supported_subentry_types(cls, config_entry: ConfigEntry) -> dict[str, type[ConfigSubentryFlow]]:
        return {SUBENTRY_ROOM: RoomSubentryFlow}

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data[CONF_NAME] = user_input[CONF_NAME]
            self._data[CONF_HEATING_TYPE] = user_input[CONF_HEATING_TYPE]
            self._curve = dict(CURVE_PRESETS[user_input[CONF_HEATING_TYPE]])
            return await self.async_step_boiler()

        schema = probatio.Schema(
            {
                probatio.Required(CONF_NAME, default=DEFAULT_NAME): TextSelector(),
                probatio.Required(CONF_HEATING_TYPE, default=HEATING_MIXED): SelectSelector(
                    SelectSelectorConfig(
                        options=list(CURVE_PRESETS),
                        mode=SelectSelectorMode.LIST,
                        translation_key=CONF_HEATING_TYPE,
                    )
                ),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_boiler(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_climate()
        return self.async_show_form(step_id="boiler", data_schema=boiler_schema({}))

    async def async_step_climate(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_curve()
        return self.async_show_form(step_id="climate", data_schema=climate_schema({}))

    async def async_step_curve(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            flow_range_valid = user_input["flow_min"] < user_input["flow_max"]
            if not flow_range_valid:
                errors["base"] = "flow_range"
            if not errors:
                self._curve = {key: float(user_input[key]) for key in CURVE_KEYS}
                return await self.async_step_curve_check()
        return self.async_show_form(step_id="curve", data_schema=curve_schema(self._curve), errors=errors)

    async def async_step_curve_check(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="curve_check",
            menu_options=["room", "curve"],
            description_placeholders={"preview": curve_preview(self._curve)},
        )

    async def async_step_room(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._rooms.append(user_input)
            return await self.async_step_rooms()
        return self.async_show_form(step_id="room", data_schema=room_schema({}, with_tuning=True))

    async def async_step_rooms(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        names = ", ".join(room[CONF_NAME] for room in self._rooms)
        return self.async_show_menu(
            step_id="rooms",
            menu_options=["room", "finish"],
            description_placeholders={"rooms": names},
        )

    async def async_step_finish(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        data = dict(self._data)
        title = data.pop(CONF_NAME)
        data[CONF_PARAMS] = dict(self._curve)
        return self.async_create_entry(
            title=title,
            data=data,
            subentries=[_room_subentry(room) for room in self._rooms],
        )

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Change boiler and weather entities; curve values are edited as entities."""
        entry = self._get_reconfigure_entry()
        current = dict(entry.data)
        if user_input is not None:
            data = {key: value for key, value in current.items() if key not in self._reconfigurable_keys()}
            data.update(user_input)
            return self.async_update_reload_and_abort(entry, data=data)

        schema = probatio.Schema({**boiler_schema(current).schema, **climate_schema(current).schema})
        return self.async_show_form(step_id="reconfigure", data_schema=schema)

    @staticmethod
    def _reconfigurable_keys() -> tuple[str, ...]:
        return (*BOILER_SCHEMA_KEYS, CONF_OUTDOOR_SENSOR, CONF_WEATHER, CONF_SCHEDULE)


class RoomSubentryFlow(ConfigSubentryFlow):
    """Add or edit a room; weight and target are later changed as entities."""

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        if user_input is not None:
            room = _room_subentry(user_input)
            return self.async_create_entry(title=room["title"], data=room["data"])
        return self.async_show_form(step_id="user", data_schema=room_schema({}, with_tuning=True))

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        subentry = self._get_reconfigure_subentry()
        if user_input is not None:
            data = {key: value for key, value in subentry.data.items() if key == CONF_WEIGHT}
            data.update({key: value for key, value in user_input.items() if key != CONF_NAME})
            return self.async_update_and_abort(self._get_entry(), subentry, data=data, title=user_input[CONF_NAME])

        defaults = {CONF_NAME: subentry.title, **subentry.data}
        return self.async_show_form(step_id="reconfigure", data_schema=room_schema(defaults, with_tuning=False))
