"""HeatCast: weather-compensated flow temperature for a boiler."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .coordinator import HeatCastCoordinator
from .entity import controller_device_info
from .frontend import async_register_frontend
from .websocket import async_register_commands

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
    async_register_commands(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HeatCastConfigEntry) -> bool:
    coordinator = HeatCastCoordinator(hass, entry)
    # Room devices hang below the controller device, so it has to exist first.
    controller = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, **controller_device_info(entry))
    coordinator.device_id = controller.id
    await coordinator.async_setup()
    if not coordinator.individual_rooms:
        _remove_individual_room_entities(hass, entry)
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


def _remove_individual_room_entities(hass: HomeAssistant, entry: HeatCastConfigEntry) -> None:
    """Room thermostats and the sync switch exist only while individual rooms are enabled."""
    registry = er.async_get(hass)
    room_thermostats = {f"{subentry_id}_thermostat" for subentry_id in entry.subentries}
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        is_room_feature = (entity.unique_id in room_thermostats) or (entity.unique_id == f"{entry.entry_id}_room_sync")
        if is_room_feature:
            registry.async_remove(entity.entity_id)


async def _async_reload(hass: HomeAssistant, entry: HeatCastConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
