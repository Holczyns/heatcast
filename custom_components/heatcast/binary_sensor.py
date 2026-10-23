"""Heating demand and forecast freshness."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HeatCastConfigEntry
from .entity import HeatCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HeatCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities([DemandSensor(coordinator, "demand"), ForecastValidSensor(coordinator, "forecast_valid")])


class DemandSensor(HeatCastEntity, BinarySensorEntity):
    _attr_device_class = BinarySensorDeviceClass.HEAT

    @property
    def is_on(self) -> bool:
        return self.coordinator.data.demand


class ForecastValidSensor(HeatCastEntity, BinarySensorEntity):
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def is_on(self) -> bool:
        return self.coordinator.data.forecast_valid
