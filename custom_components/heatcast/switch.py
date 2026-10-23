"""Boiler control on/off and the boiler test mode."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
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
    switches: list[SwitchEntity] = [ControlSwitch(coordinator, "control"), TestModeSwitch(coordinator, "test_mode")]
    if coordinator.individual_rooms:
        switches.append(RoomSyncSwitch(coordinator, "room_sync"))
    async_add_entities(switches)


class ControlSwitch(HeatCastEntity, SwitchEntity):
    """Off: shadow mode, the model runs but nothing is sent to the boiler or valves."""

    @property
    def is_on(self) -> bool:
        return self.coordinator.control_active

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(False)


class RoomSyncSwitch(HeatCastEntity, SwitchEntity):
    """On: every room follows the main thermostat. Off: each room keeps its own target."""

    @property
    def is_on(self) -> bool:
        return self.coordinator.rooms_synchronised

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.coordinator.async_set_rooms_synchronised(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.coordinator.async_set_rooms_synchronised(False)


class TestModeSwitch(HeatCastEntity, SwitchEntity):
    """Sends the fixed test flow regardless of the model; switches itself off after an hour."""

    @property
    def is_on(self) -> bool:
        return self.coordinator.test_mode

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_test_mode(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_test_mode(False)
