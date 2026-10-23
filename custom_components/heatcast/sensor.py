"""Values computed by the model, for dashboards and history."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfSpeed, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HeatCastConfigEntry
from .coordinator import HeatCastCoordinator
from .engine import Snapshot
from .entity import HeatCastEntity, HeatCastRoomEntity

KELVIN = UnitOfTemperature.KELVIN
CELSIUS = UnitOfTemperature.CELSIUS


@dataclass(frozen=True, kw_only=True)
class HeatCastSensorDescription(SensorEntityDescription):
    value: Callable[[HeatCastCoordinator, Snapshot], float | datetime | None]


def _outdoor(attribute: str) -> Callable[[HeatCastCoordinator, Snapshot], float | None]:
    def value(_coordinator: HeatCastCoordinator, snapshot: Snapshot) -> float | None:
        if snapshot.outdoor is None:
            return None
        return getattr(snapshot.outdoor, attribute)

    return value


def _forecast(attribute: str, scale: float = 1.0) -> Callable[[HeatCastCoordinator, Snapshot], float | None]:
    def value(coordinator: HeatCastCoordinator, _snapshot: Snapshot) -> float | None:
        forecast = coordinator.model.state.forecast
        if forecast is None:
            return None
        return round(getattr(forecast, attribute) * scale, 2)

    return value


def _temperature(key: str, value, *, diagnostic: bool = False, delta: bool = False) -> HeatCastSensorDescription:
    return HeatCastSensorDescription(
        key=key,
        device_class=None if delta else SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=KELVIN if delta else CELSIUS,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1 if not delta else 2,
        entity_category=EntityCategory.DIAGNOSTIC if diagnostic else None,
        value=value,
    )


SENSORS: tuple[HeatCastSensorDescription, ...] = (
    _temperature("flow_setpoint", lambda _c, s: s.flow),
    _temperature("curve_flow", lambda _c, s: s.curve),
    _temperature("room_temperature", lambda _c, s: s.room.temperature),
    _temperature("setpoint", lambda _c, s: s.setpoint),
    _temperature("outdoor_effective", _outdoor("effective")),
    _temperature("outdoor_switch", _outdoor("switch"), diagnostic=True),
    _temperature("room_error", lambda _c, s: s.room.error, delta=True),
    _temperature("room_correction", lambda _c, s: s.correction, delta=True),
    _temperature("proportional", lambda _c, s: s.p_term, delta=True, diagnostic=True),
    _temperature("forecast_effect", _outdoor("forecast_effect"), delta=True),
    _temperature("solar_correction", _outdoor("solar"), delta=True),
    _temperature("wind_correction", _outdoor("wind"), delta=True),
    _temperature("forecast_delta", _forecast("delta"), delta=True, diagnostic=True),
    HeatCastSensorDescription(
        key="room_coverage",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value=lambda _c, s: round(s.room.coverage * 100),
    ),
    HeatCastSensorDescription(
        key="forecast_cloud",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value=_forecast("cloud"),
    ),
    HeatCastSensorDescription(
        key="forecast_wind",
        device_class=SensorDeviceClass.WIND_SPEED,
        native_unit_of_measurement=UnitOfSpeed.KILOMETERS_PER_HOUR,
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value=_forecast("wind"),
    ),
    HeatCastSensorDescription(
        key="forecast_daylight",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value=_forecast("daylight", scale=100),
    ),
    HeatCastSensorDescription(
        key="forecast_updated",
        device_class=SensorDeviceClass.TIMESTAMP,
        entity_category=EntityCategory.DIAGNOSTIC,
        value=lambda c, _s: c.model.state.forecast.updated if c.model.state.forecast else None,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HeatCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(HeatCastSensor(coordinator, description) for description in SENSORS)
    for room in coordinator.rooms.values():
        async_add_entities(
            [RoomTemperatureSensor(coordinator, room, "filtered"), RoomTemperatureSensor(coordinator, room, "target")],
            config_subentry_id=room.subentry_id,
        )


class HeatCastSensor(HeatCastEntity, SensorEntity):
    entity_description: HeatCastSensorDescription

    def __init__(self, coordinator: HeatCastCoordinator, description: HeatCastSensorDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float | datetime | None:
        return self.entity_description.value(self.coordinator, self.coordinator.data)


class RoomTemperatureSensor(HeatCastRoomEntity, SensorEntity):
    """Filtered temperature used by the model, or the target sent to the valve."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = CELSIUS
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    def __init__(self, coordinator: HeatCastCoordinator, room, kind: str) -> None:
        super().__init__(coordinator, room, kind)
        self._kind = kind

    @property
    def native_value(self) -> float | None:
        if self._kind == "target":
            return self.coordinator.data.room_targets.get(self.room_key)
        return self.coordinator.model.state.filtered.get(self.room_key)
