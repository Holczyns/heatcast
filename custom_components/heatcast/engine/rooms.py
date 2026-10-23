"""Room readings: rate-limit filter and weighted aggregation."""

from __future__ import annotations

from dataclasses import dataclass

from .params import (
    ROOM_COVERAGE_MIN,
    ROOM_READING_MAX_AGE_S,
    ROOM_TEMP_MAX,
    ROOM_TEMP_MIN,
)


@dataclass(frozen=True, slots=True)
class RoomConfig:
    """Static configuration of one room."""

    key: str
    weight: float = 1.0
    offset: float = 0.0
    """Room target relative to the house setpoint (K)."""


@dataclass(frozen=True, slots=True)
class RoomReading:
    """Raw sensor state at the moment of a filter step."""

    value: float | None
    """None when the state is not a number."""
    age_s: float | None = 0.0
    """Seconds since the sensor last reported, None when unknown."""
    missing_s: float | None = None
    """Seconds since the sensor became unavailable, None while it is present."""


@dataclass(frozen=True, slots=True)
class RoomSummary:
    temperature: float | None
    coverage: float
    error: float | None
    """Weighted (target - filtered temperature), positive when too cold."""


def is_plausible(value: float | None) -> bool:
    return (value is not None) and (ROOM_TEMP_MIN <= value <= ROOM_TEMP_MAX)


def filter_step(
    reading: RoomReading,
    filtered: float | None,
    step_max: float,
    hold_s: float,
) -> float | None:
    """Advance the rate-limit filter by one step; None marks an invalid room.

    A valid reading moves the filter by at most step_max. A sensor that
    dropped out recently keeps the last filtered value. A sensor returning
    after an invalid period resynchronises without limiting.
    """
    age_s = reading.age_s if reading.age_s is not None else float("inf")
    raw_valid = is_plausible(reading.value) and (age_s < ROOM_READING_MAX_AGE_S)
    filtered_valid = is_plausible(filtered)
    briefly_missing = (reading.missing_s is not None) and (0 <= reading.missing_s < hold_s)

    new_value: float | None = None
    if raw_valid:
        new_value = reading.value
    if raw_valid and filtered_valid:
        step = max(min(reading.value - filtered, step_max), -step_max)
        new_value = filtered + step
    if (not raw_valid) and filtered_valid and briefly_missing:
        new_value = filtered

    if new_value is None:
        return None
    return round(new_value, 2)


def summarize(
    rooms: list[RoomConfig],
    filtered: dict[str, float | None],
    setpoint: float | None,
) -> RoomSummary:
    """Weighted temperature, weight coverage and weighted error over valid rooms."""
    weight_all = 0.0
    weight_valid = 0.0
    weighted_temp = 0.0
    weighted_error = 0.0
    for room in rooms:
        value = filtered.get(room.key)
        weight_all += room.weight
        room_counts = (room.weight > 0) and is_plausible(value)
        if not room_counts:
            continue
        weight_valid += room.weight
        weighted_temp += room.weight * value
        if setpoint is not None:
            weighted_error += room.weight * (setpoint + room.offset - value)

    coverage = round(weight_valid / weight_all, 2) if weight_all > 0 else 0.0
    covered = (coverage >= ROOM_COVERAGE_MIN) and (weight_valid > 0)

    temperature = None
    error = None
    if covered:
        temperature = round(weighted_temp / weight_valid, 1)
    if covered and (setpoint is not None):
        error = round(weighted_error / weight_valid, 2)
    return RoomSummary(temperature=temperature, coverage=coverage, error=error)


def room_target(setpoint: float | None, room: RoomConfig) -> float | None:
    """Target temperature of a single room, used for radiator valves."""
    if setpoint is None:
        return None
    return setpoint + room.offset
