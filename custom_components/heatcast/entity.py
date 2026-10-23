"""Base entities: one device for the controller, one per room."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import HeatCastCoordinator


def controller_device_info(entry: ConfigEntry) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name=entry.title,
        manufacturer="HeatCast",
        model="Flow temperature controller",
    )


class HeatCastEntity(CoordinatorEntity[HeatCastCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: HeatCastCoordinator, key: str) -> None:
        super().__init__(coordinator)
        entry = coordinator.entry
        self._attr_translation_key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = controller_device_info(entry)


class HeatCastRoomEntity(CoordinatorEntity[HeatCastCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: HeatCastCoordinator, room: ConfigSubentry, key: str) -> None:
        super().__init__(coordinator)
        self.room_key = room.subentry_id
        self._attr_translation_key = f"room_{key}"
        self._attr_unique_id = f"{room.subentry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, room.subentry_id)},
            name=room.title,
            manufacturer="HeatCast",
            model="Room",
            via_device_id=coordinator.device_id,
        )
