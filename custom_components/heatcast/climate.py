"""Thermostat view of the controller: house temperature, setpoint, heating on/off."""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import ClimateEntity, ClimateEntityFeature, HVACAction, HVACMode
from homeassistant.const import ATTR_TEMPERATURE, STATE_ON, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HeatCastConfigEntry
from .const import CONF_FLAME_SENSOR, CONF_SCHEDULE
from .entity import HeatCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HeatCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([HeatCastClimate(entry.runtime_data, "thermostat")])


class HeatCastClimate(HeatCastEntity, ClimateEntity):
    """Setting the temperature changes the comfort or eco value, whichever is active now.

    Off means no heating demand: the boiler is blocked when control is on.
    """

    _attr_name = None
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE | ClimateEntityFeature.TURN_ON | ClimateEntityFeature.TURN_OFF
    )
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    _attr_min_temp = 5
    _attr_max_temp = 30

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

    @property
    def hvac_action(self) -> HVACAction:
        snapshot = self.coordinator.data
        if not self.coordinator.heating_enabled:
            return HVACAction.OFF
        heating = snapshot.demand and bool(snapshot.flow)
        flame_sensor = self.coordinator.options.get(CONF_FLAME_SENSOR)
        if flame_sensor:
            heating = self.hass.states.is_state(flame_sensor, STATE_ON)
        if heating:
            return HVACAction.HEATING
        return HVACAction.IDLE

    async def async_set_temperature(self, **kwargs: Any) -> None:
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return
        key = "eco_temp"
        if self._comfort_active():
            key = "comfort_temp"
        self.coordinator.async_set_param(key, float(temperature))

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        self.coordinator.async_set_heating_enabled(hvac_mode == HVACMode.HEAT)

    def _comfort_active(self) -> bool:
        schedule = self.coordinator.options.get(CONF_SCHEDULE)
        if not schedule:
            return True
        return self.hass.states.is_state(schedule, STATE_ON)
