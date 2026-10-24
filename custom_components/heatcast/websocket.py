"""Websocket commands used by the HeatCast panel.

Reading is open to every user; every change requires an administrator.
Changes go through the config entry and its room subentries, exactly as
the setup wizard stores them, so the entry reloads afterwards.
"""

from __future__ import annotations

from types import MappingProxyType
from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant, callback, split_entity_id
from homeassistant.helpers import entity_registry as er

from .const import (
    CONF_BLOCK_ENTITY,
    CONF_DHW_SENSOR,
    CONF_FLAME_SENSOR,
    CONF_FLOW_ENTITY,
    CONF_FLOW_SENSOR,
    CONF_IDLE_FLOW,
    CONF_INDIVIDUAL_ROOMS,
    CONF_NOTIFY_SERVICE,
    CONF_OUTDOOR_SENSOR,
    CONF_SCHEDULE,
    CONF_SENSOR,
    CONF_VALVE,
    CONF_VALVE_TEMPERATURE,
    CONF_WEATHER,
    CONF_WEIGHT,
    DEFAULT_WEIGHT,
    DOMAIN,
    SUBENTRY_ROOM,
)
from .problems import notify_services

# Entity fields of the main entry: allowed domains and whether they are required.
SOURCE_FIELDS: dict[str, tuple[tuple[str, ...], bool]] = {
    CONF_FLOW_ENTITY: (("number", "input_number"), True),
    CONF_BLOCK_ENTITY: (("switch", "input_boolean"), False),
    CONF_FLOW_SENSOR: (("sensor",), False),
    CONF_FLAME_SENSOR: (("binary_sensor",), False),
    CONF_DHW_SENSOR: (("binary_sensor",), False),
    CONF_OUTDOOR_SENSOR: (("sensor",), True),
    CONF_WEATHER: (("weather",), False),
    CONF_SCHEDULE: (("schedule",), False),
}
ROOM_FIELDS: dict[str, tuple[tuple[str, ...], bool]] = {
    CONF_SENSOR: (("sensor",), True),
    CONF_VALVE: (("climate",), False),
    CONF_VALVE_TEMPERATURE: (("number", "input_number"), False),
}


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    for command in (ws_entries, ws_set_options, ws_update_sources, ws_add_room, ws_update_room, ws_remove_room):
        websocket_api.async_register_command(hass, command)


def _describe(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    """Entity ids by key, so the panel does not depend on entity naming."""
    registry = er.async_get(hass)
    controller: dict[str, str] = {}
    rooms: dict[str, dict[str, Any]] = {
        subentry_id: {
            "id": subentry_id,
            "name": subentry.title,
            **{key: subentry.data.get(key) for key in ROOM_FIELDS},
            "entities": {},
        }
        for subentry_id, subentry in entry.subentries.items()
        if subentry.subentry_type == SUBENTRY_ROOM
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
        "notify_service": entry.options.get(CONF_NOTIFY_SERVICE),
        "notify_services": notify_services(hass),
        "sources": {key: entry.data.get(key) for key in SOURCE_FIELDS},
        "idle_flow": entry.data.get(CONF_IDLE_FLOW, 0),
        "entities": controller,
        "rooms": list(rooms.values()),
    }


def _entry(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> ConfigEntry | None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if (entry is None) or (entry.domain != DOMAIN):
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown HeatCast entry")
        return None
    return entry


def _entity_errors(
    hass: HomeAssistant, values: dict[str, Any], fields: dict[str, tuple[tuple[str, ...], bool]]
) -> list[str]:
    """Each chosen entity has to exist and belong to one of the allowed domains."""
    errors = []
    for key, (domains, required) in fields.items():
        entity_id = values.get(key)
        if not entity_id:
            if required:
                errors.append(f"{key} is required")
            continue
        exists = hass.states.get(entity_id) is not None
        domain_allowed = split_entity_id(entity_id)[0] in domains
        if not (exists and domain_allowed):
            errors.append(f"{key}: {entity_id} is not a known {'/'.join(domains)} entity")
    return errors


def _clean(values: dict[str, Any], fields: dict[str, Any]) -> dict[str, Any]:
    """Keep the entity fields; an empty optional field is dropped."""
    return {key: values[key] for key in fields if values.get(key)}


def _room(entry: ConfigEntry, room_id: str) -> ConfigSubentry | None:
    subentry = entry.subentries.get(room_id)
    if (subentry is None) or (subentry.subentry_type != SUBENTRY_ROOM):
        return None
    return subentry


ENTITY_VALUE = probatio.Any(str, None)


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
        probatio.Optional(CONF_INDIVIDUAL_ROOMS): bool,
        probatio.Optional(CONF_NOTIFY_SERVICE): probatio.Any(str, None),
    }
)
@callback
def ws_set_options(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Same options as the options flow; fields not sent stay as they are.

    The entry reloads through its update listener.
    """
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    options = dict(entry.options)
    if CONF_INDIVIDUAL_ROOMS in msg:
        options[CONF_INDIVIDUAL_ROOMS] = msg[CONF_INDIVIDUAL_ROOMS]
    if CONF_NOTIFY_SERVICE in msg:
        service = msg[CONF_NOTIFY_SERVICE]
        if service and not hass.services.has_service("notify", service):
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, f"notify.{service} does not exist")
            return
        options.pop(CONF_NOTIFY_SERVICE, None)
        if service:
            options[CONF_NOTIFY_SERVICE] = service
    hass.config_entries.async_update_entry(entry, options=options)
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "heatcast/update_sources",
        probatio.Required("entry_id"): str,
        **{probatio.Optional(key): ENTITY_VALUE for key in SOURCE_FIELDS},
        probatio.Optional(CONF_IDLE_FLOW): probatio.All(probatio.Coerce(float), probatio.Range(min=0, max=40)),
    }
)
@callback
def ws_update_sources(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Replace the boiler and weather entities; fields not sent are cleared if optional."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    errors = _entity_errors(hass, msg, SOURCE_FIELDS)
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {key: value for key, value in entry.data.items() if key not in SOURCE_FIELDS}
    data.update(_clean(msg, SOURCE_FIELDS))
    if CONF_IDLE_FLOW in msg:
        data[CONF_IDLE_FLOW] = msg[CONF_IDLE_FLOW]
    hass.config_entries.async_update_entry(entry, data=data)
    connection.send_result(msg["id"])


ROOM_SCHEMA = {
    probatio.Required("entry_id"): str,
    probatio.Required("name"): probatio.All(str, probatio.Length(min=1, max=60)),
    **{probatio.Optional(key): ENTITY_VALUE for key in ROOM_FIELDS},
}


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "heatcast/add_room",
        **ROOM_SCHEMA,
        probatio.Optional(CONF_WEIGHT, default=DEFAULT_WEIGHT): probatio.All(
            probatio.Coerce(float), probatio.Range(min=0, max=1)
        ),
    }
)
@callback
def ws_add_room(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    errors = _entity_errors(hass, msg, ROOM_FIELDS)
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {**_clean(msg, ROOM_FIELDS), CONF_WEIGHT: msg[CONF_WEIGHT]}
    subentry = ConfigSubentry(
        data=MappingProxyType(data), subentry_type=SUBENTRY_ROOM, title=msg["name"].strip(), unique_id=None
    )
    hass.config_entries.async_add_subentry(entry, subentry)
    connection.send_result(msg["id"], {"room_id": subentry.subentry_id})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {probatio.Required("type"): "heatcast/update_room", probatio.Required("room_id"): str, **ROOM_SCHEMA}
)
@callback
def ws_update_room(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Rename a room or change its sensor and valve; its weight stays as it is."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    subentry = _room(entry, msg["room_id"])
    if subentry is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown room")
        return
    errors = _entity_errors(hass, msg, ROOM_FIELDS)
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {key: value for key, value in subentry.data.items() if key not in ROOM_FIELDS}
    data.update(_clean(msg, ROOM_FIELDS))
    hass.config_entries.async_update_subentry(entry, subentry, data=data, title=msg["name"].strip())
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "heatcast/remove_room",
        probatio.Required("entry_id"): str,
        probatio.Required("room_id"): str,
    }
)
@callback
def ws_remove_room(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    if _room(entry, msg["room_id"]) is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown room")
        return
    hass.config_entries.async_remove_subentry(entry, msg["room_id"])
    connection.send_result(msg["id"])
