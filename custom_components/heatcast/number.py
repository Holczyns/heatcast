"""Tuning parameters, room weights and offsets, and editable model state."""

from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberEntityDescription, NumberMode
from homeassistant.config_entries import ConfigSubentry
from homeassistant.const import EntityCategory, UnitOfSpeed, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HeatCastConfigEntry
from .const import CONF_OFFSET, CONF_WEIGHT
from .coordinator import HeatCastCoordinator
from .entity import HeatCastEntity, HeatCastRoomEntity

CELSIUS = UnitOfTemperature.CELSIUS
KELVIN = UnitOfTemperature.KELVIN
CONFIG = EntityCategory.CONFIG


def _number(
    key: str,
    minimum: float,
    maximum: float,
    step: float,
    unit: str | None = None,
    *,
    category: EntityCategory | None = CONFIG,
    temperature: bool = False,
) -> NumberEntityDescription:
    return NumberEntityDescription(
        key=key,
        mode=NumberMode.BOX,
        native_min_value=minimum,
        native_max_value=maximum,
        native_step=step,
        native_unit_of_measurement=unit,
        device_class=NumberDeviceClass.TEMPERATURE if temperature else None,
        entity_category=category,
    )


PARAMETERS: tuple[NumberEntityDescription, ...] = (
    _number("comfort_temp", 5, 30, 0.5, CELSIUS, category=None, temperature=True),
    _number("eco_temp", 5, 30, 0.5, CELSIUS, category=None, temperature=True),
    _number("room_rate_max", 0.05, 2, 0.05, "K/h"),
    _number("sensor_hold_min", 0, 120, 5, UnitOfTime.MINUTES),
    _number("damping_tau_h", 0.5, 24, 0.5, UnitOfTime.HOURS),
    _number("forecast_horizon_h", 1, 12, 1, UnitOfTime.HOURS),
    _number("forecast_weight", 0, 1, 0.05),
    _number("k_solar", 0, 5, 0.1, KELVIN),
    _number("k_wind", 0, 1, 0.01, "K/(km/h)"),
    _number("wind_ref", 0, 60, 1, UnitOfSpeed.KILOMETERS_PER_HOUR),
    _number("kp", 0, 10, 0.1, "K/K"),
    _number("ti_min", 10, 1000, 10, UnitOfTime.MINUTES),
    _number("design_temp", 20, 80, 1, CELSIUS, temperature=True),
    _number("outdoor_min", -40, 0, 1, CELSIUS, temperature=True),
    _number("curve_exponent", 1, 2, 0.05),
    _number("curve_offset", -10, 10, 0.5, KELVIN),
    _number("summer_temp", 5, 25, 0.5, CELSIUS, temperature=True),
    _number("flow_min", 10, 40, 1, CELSIUS, temperature=True),
    _number("flow_max", 25, 85, 1, CELSIUS, temperature=True),
)

# Model state exposed for seeding, as the helpers it replaces allowed.
STATE_VALUES: tuple[NumberEntityDescription, ...] = (
    _number("integral", -3, 3, 0.01, KELVIN, category=EntityCategory.DIAGNOSTIC),
    _number("outdoor_damped", -40, 40, 0.01, CELSIUS, category=EntityCategory.DIAGNOSTIC, temperature=True),
)

TEST_FLOW = _number("test_flow", 20, 60, 1, CELSIUS, temperature=True)

ROOM_TUNING: tuple[NumberEntityDescription, ...] = (
    _number(CONF_WEIGHT, 0, 1, 0.05),
    _number(CONF_OFFSET, -3, 3, 0.5, KELVIN),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HeatCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    entities: list[NumberEntity] = [ParameterNumber(coordinator, description) for description in PARAMETERS]
    entities += [StateNumber(coordinator, description) for description in STATE_VALUES]
    entities.append(TestFlowNumber(coordinator, TEST_FLOW))
    async_add_entities(entities)
    for room in coordinator.rooms.values():
        async_add_entities(
            [RoomTuningNumber(coordinator, room, description) for description in ROOM_TUNING],
            config_subentry_id=room.subentry_id,
        )


class ParameterNumber(HeatCastEntity, NumberEntity):
    entity_description: NumberEntityDescription

    def __init__(self, coordinator: HeatCastCoordinator, description: NumberEntityDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        return self.coordinator.params[self.entity_description.key]

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_param(self.entity_description.key, value)


class StateNumber(ParameterNumber):
    @property
    def native_value(self) -> float | None:
        state = self.coordinator.model.state
        if self.entity_description.key == "integral":
            return state.integral
        return state.damped

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_state_value(self.entity_description.key, value)


class TestFlowNumber(ParameterNumber):
    @property
    def native_value(self) -> float:
        return self.coordinator.test_flow

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_test_flow(value)


class RoomTuningNumber(HeatCastRoomEntity, NumberEntity):
    entity_description: NumberEntityDescription

    def __init__(
        self, coordinator: HeatCastCoordinator, room: ConfigSubentry, description: NumberEntityDescription
    ) -> None:
        super().__init__(coordinator, room, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        return self.coordinator.room_tuning[self.room_key][self.entity_description.key]

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_room_tuning(self.room_key, self.entity_description.key, value)
