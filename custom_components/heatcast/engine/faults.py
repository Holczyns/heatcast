"""Fault detection: conditions read from the current scan, reported after a delay.

A condition becomes a fault once it has held for its delay and is cleared
on the first scan it no longer holds. While a condition cannot be judged
(the boiler heats hot water and reports its own setpoint), it is held:
neither started, cleared nor raised. State kept between scans: when each
condition started and which faults are reported; both start empty after a
restart.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import StrEnum

# Boiler setpoint differing by at least this from the written value (K).
SETPOINT_TOLERANCE = 1.0
# Fewer room sensors than this share of the weight counts as lost.
COVERAGE_MIN = 0.5
# Measured flow above the maximum flow temperature by more than this (K).
FLOW_MARGIN = 10.0


class Fault(StrEnum):
    SETPOINT_NOT_ACCEPTED = "setpoint_not_accepted"
    ROOM_SENSORS_LOST = "room_sensors_lost"
    OUTDOOR_LOST = "outdoor_lost"
    FLOW_TOO_HIGH = "flow_too_high"


DELAYS: dict[Fault, timedelta] = {
    Fault.SETPOINT_NOT_ACCEPTED: timedelta(minutes=3),
    Fault.ROOM_SENSORS_LOST: timedelta(minutes=15),
    Fault.OUTDOOR_LOST: timedelta(minutes=15),
    Fault.FLOW_TOO_HIGH: timedelta(minutes=10),
}


@dataclass(frozen=True, slots=True)
class FaultInputs:
    control_active: bool
    written_flow: int | None
    """Flow setpoint written in this scan, None when nothing was written."""
    boiler_flow: float | None
    """Setpoint the boiler reports back, None when unavailable."""
    hot_water: bool
    """The boiler heats hot water and reports its own setpoint meanwhile."""
    has_rooms: bool
    coverage: float
    outdoor: float | None
    measured_flow: float | None
    flow_max: float


def conditions(inputs: FaultInputs) -> set[Fault]:
    """Faulty conditions in this scan, before their delays."""
    found: set[Fault] = set()

    # 1. The boiler does not take over the written setpoint (also when writes fail).
    if (inputs.written_flow is not None) and (not inputs.hot_water):
        setpoint_differs = (inputs.boiler_flow is None) or (
            abs(inputs.boiler_flow - inputs.written_flow) >= SETPOINT_TOLERANCE
        )
        if setpoint_differs:
            found.add(Fault.SETPOINT_NOT_ACCEPTED)

    # 2. Too few room sensors; the controller runs on the curve alone.
    if inputs.has_rooms and (inputs.coverage < COVERAGE_MIN):
        found.add(Fault.ROOM_SENSORS_LOST)

    # 3. No outdoor temperature.
    if inputs.outdoor is None:
        found.add(Fault.OUTDOOR_LOST)

    # 4. Flow far above the configured maximum while HeatCast controls space heating.
    flow_too_high = (inputs.measured_flow is not None) and (inputs.measured_flow > inputs.flow_max + FLOW_MARGIN)
    if inputs.control_active and (not inputs.hot_water) and flow_too_high:
        found.add(Fault.FLOW_TOO_HIGH)

    return found


def undetermined(inputs: FaultInputs) -> set[Fault]:
    """Conditions that cannot be judged in this scan; their state is held."""
    if inputs.hot_water:
        return {Fault.SETPOINT_NOT_ACCEPTED, Fault.FLOW_TOO_HIGH}
    return set()


@dataclass(slots=True)
class FaultMonitor:
    since: dict[Fault, datetime] = field(default_factory=dict)
    """When each present condition started."""
    active: set[Fault] = field(default_factory=set)
    """Faults reported right now."""

    def update(
        self, present: set[Fault], now: datetime, held: set[Fault] | None = None
    ) -> tuple[set[Fault], set[Fault]]:
        """Advance by one scan; returns the faults raised and cleared in it."""
        held = held or set()
        for fault in list(self.since):
            if (fault not in present) and (fault not in held):
                del self.since[fault]
        for fault in present - held:
            self.since.setdefault(fault, now)

        # A held fault keeps its reported state until it can be judged again.
        due = {fault for fault, start in self.since.items() if (fault not in held) and (now - start >= DELAYS[fault])}
        due |= self.active & held
        raised = due - self.active
        cleared = self.active - due
        self.active = due
        return raised, cleared
