"""Reporting of faults: a repair issue per fault and an optional notification.

Issues are created when a fault is raised and deleted when it clears, so
the Repairs page always shows the faults present right now.
"""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import issue_registry as ir

from .const import CONF_NOTIFY_SERVICE, DOMAIN
from .engine import Fault

_LOGGER = logging.getLogger(__name__)

SEVERITY: dict[Fault, ir.IssueSeverity] = {
    Fault.SETPOINT_NOT_ACCEPTED: ir.IssueSeverity.ERROR,
    Fault.ROOM_SENSORS_LOST: ir.IssueSeverity.WARNING,
    Fault.OUTDOOR_LOST: ir.IssueSeverity.ERROR,
    Fault.FLOW_TOO_HIGH: ir.IssueSeverity.ERROR,
}

TITLES: dict[Fault, str] = {
    Fault.SETPOINT_NOT_ACCEPTED: "boiler does not accept the flow setpoint",
    Fault.ROOM_SENSORS_LOST: "room sensors lost",
    Fault.OUTDOOR_LOST: "outdoor temperature lost",
    Fault.FLOW_TOO_HIGH: "flow temperature too high",
}

MESSAGES: dict[Fault, str] = {
    Fault.SETPOINT_NOT_ACCEPTED: (
        "HeatCast writes {written_flow} °C, the boiler has reported {boiler_flow} °C for 3 minutes. "
        "Check the boiler and its connection; if in doubt, turn off Boiler control."
    ),
    Fault.ROOM_SENSORS_LOST: (
        "Less than half of the room weight has had a valid temperature for 15 minutes. "
        "The flow temperature follows the heating curve alone."
    ),
    Fault.OUTDOOR_LOST: (
        "The outdoor sensor has had no value for 15 minutes. "
        "HeatCast keeps working with the last damped outdoor temperature."
    ),
    Fault.FLOW_TOO_HIGH: (
        "The measured flow temperature has been {measured_flow} °C for 10 minutes, outside hot water heating."
    ),
}


def notify_services(hass: HomeAssistant) -> list[str]:
    """Legacy notify services such as mobile_app_phone; send_message needs an entity instead."""
    return sorted(service for service in hass.services.async_services_for_domain("notify") if service != "send_message")


def _issue_id(entry: ConfigEntry, fault: Fault) -> str:
    return f"{entry.entry_id}_{fault}"


def async_clear_issues(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Fault timers start again after a reload, so old issues go with it."""
    for fault in Fault:
        ir.async_delete_issue(hass, DOMAIN, _issue_id(entry, fault))


async def async_report(
    hass: HomeAssistant,
    entry: ConfigEntry,
    raised: set[Fault],
    cleared: set[Fault],
    values: dict[str, str],
) -> None:
    placeholders = {"name": entry.title, **values}
    for fault in raised:
        _LOGGER.warning("%s: %s", entry.title, TITLES[fault])
        ir.async_create_issue(
            hass,
            DOMAIN,
            _issue_id(entry, fault),
            is_fixable=False,
            is_persistent=False,
            severity=SEVERITY[fault],
            translation_key=str(fault),
            translation_placeholders=placeholders,
        )
        await _async_notify(hass, entry, f"{entry.title}: {TITLES[fault]}", MESSAGES[fault].format(**placeholders))
    for fault in cleared:
        _LOGGER.info("%s: resolved, %s", entry.title, TITLES[fault])
        ir.async_delete_issue(hass, DOMAIN, _issue_id(entry, fault))
        await _async_notify(hass, entry, f"{entry.title}: resolved", f"Resolved: {TITLES[fault]}.")


async def _async_notify(hass: HomeAssistant, entry: ConfigEntry, title: str, message: str) -> None:
    service = entry.options.get(CONF_NOTIFY_SERVICE)
    if not service:
        return
    try:
        await hass.services.async_call("notify", service, {"title": title, "message": message}, blocking=False)
    except HomeAssistantError as err:
        _LOGGER.warning("Notification through notify.%s failed: %s", service, err)
