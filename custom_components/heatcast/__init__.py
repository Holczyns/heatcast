"""HeatCast: weather-compensated flow temperature for a boiler."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .coordinator import HeatCastCoordinator
from .entity import controller_device_info
from .frontend import async_register_card

PLATFORMS = (
    Platform.BINARY_SENSOR,
    Platform.CLIMATE,
    Platform.NUMBER,
    Platform.SENSOR,
    Platform.SWITCH,
)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type HeatCastConfigEntry = ConfigEntry[HeatCastCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await async_register_card(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HeatCastConfigEntry) -> bool:
    coordinator = HeatCastCoordinator(hass, entry)
    # Room devices hang below the controller device, so it has to exist first.
    controller = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, **controller_device_info(entry))
    coordinator.device_id = controller.id
    await coordinator.async_setup()
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Adding, editing or removing a room changes the entity set.
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: HeatCastConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_shutdown()
    return unloaded


async def _async_reload(hass: HomeAssistant, entry: HeatCastConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
