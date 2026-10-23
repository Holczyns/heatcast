"""Websocket commands used by the HeatCast panel."""

from __future__ import annotations

from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import (
    CONF_BLOCK_ENTITY,
    CONF_DHW_SENSOR,
    CONF_FLAME_SENSOR,
    CONF_FLOW_ENTITY,
    CONF_FLOW_SENSOR,
    CONF_INDIVIDUAL_ROOMS,
    CONF_OUTDOOR_SENSOR,
    CONF_SENSOR,
    CONF_VALVE,
    CONF_WEATHER,
    DOMAIN,
)

SOURCE_KEYS = (
    CONF_FLOW_ENTITY,
    CONF_BLOCK_ENTITY,
    CONF_FLOW_SENSOR,
    CONF_FLAME_SENSOR,
    CONF_DHW_SENSOR,
    CONF_OUTDOOR_SENSOR,
    CONF_WEATHER,
)


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_entries)
    websocket_api.async_register_command(hass, ws_set_options)


def _describe(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    """Entity ids by key, so the panel does not depend on entity naming."""
    registry = er.async_get(hass)
    controller: dict[str, str] = {}
    rooms: dict[str, dict[str, Any]] = {
        subentry_id: {
            "id": subentry_id,
            "name": subentry.title,
            "sensor": subentry.data.get(CONF_SENSOR),
            "valve": subentry.data.get(CONF_VALVE),
            "entities": {},
        }
        for subentry_id, subentry in entry.subentries.items()
    }
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        owner, _, key = entity.unique_id.partition("_")
        if owner == entry.entry_id:
            controller[key] = entity.entity_id
        elif owner in rooms:
            rooms[owner]["entities"][key] = entity.entity_id

    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "individual_rooms": entry.options.get(CONF_INDIVIDUAL_ROOMS, False),
        "sources": {key: entry.data.get(key) for key in SOURCE_KEYS},
        "entities": controller,
        "rooms": list(rooms.values()),
    }


@websocket_api.websocket_command({probatio.Required("type"): "heatcast/entries"})
@callback
def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entries = [_describe(hass, entry) for entry in hass.config_entries.async_loaded_entries(DOMAIN)]
    connection.send_result(msg["id"], entries)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "heatcast/set_options",
        probatio.Required("entry_id"): str,
        probatio.Required(CONF_INDIVIDUAL_ROOMS): bool,
    }
)
@callback
def ws_set_options(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Same option as the options flow; the entry reloads through its update listener."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if (entry is None) or (entry.domain != DOMAIN):
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown HeatCast entry")
        return
    options = {**entry.options, CONF_INDIVIDUAL_ROOMS: msg[CONF_INDIVIDUAL_ROOMS]}
    hass.config_entries.async_update_entry(entry, options=options)
    connection.send_result(msg["id"])
