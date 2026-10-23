"""Heating curve, room correction (PI), demand and flow setpoint."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .params import DEMAND_DELAY_S, INTEGRAL_LIMIT, PROPORTIONAL_LIMIT, Params


def eco_shift(comfort_active: bool, params: Params) -> float:
    """Setback applied to every target outside the comfort schedule."""
    shift = params.eco_offset
    if comfort_active:
        shift = 0.0
    return shift


def curve_flow(setpoint: float | None, effective: float | None, params: Params) -> float | None:
    """T = T_set + (T_design - T_set) * r^(1/n) + offset, r = load relative to design."""
    if (setpoint is None) or (effective is None):
        return None
    design_span = setpoint - params.outdoor_min
    if design_span <= 0:
        return None
    load_ratio = max(setpoint - effective, 0.0) / design_span
    flow = setpoint + (params.design_temp - setpoint) * load_ratio ** (1 / params.curve_exponent)
    return round(flow + params.curve_offset, 2)


def proportional(error: float | None, params: Params) -> float | None:
    if error is None:
        return None
    return round(max(min(params.kp * error, PROPORTIONAL_LIMIT), -PROPORTIONAL_LIMIT), 2)


def correction(p_term: float | None, integral: float) -> float:
    """Room correction is P + I; without a room error the curve runs alone."""
    if p_term is None:
        return 0.0
    return round(p_term + integral, 2)


def integrate(
    integral: float,
    error: float | None,
    demand: bool,
    flow_raw: float,
    step_min: float,
    params: Params,
) -> float:
    """Advance the integral one step unless one of the locks holds.

    Locks: no room error, no heating demand, or output saturated in the
    direction the error pushes (anti-windup).
    """
    if error is None:
        return integral
    if not demand:
        return integral
    at_max = flow_raw >= params.flow_max
    at_min = flow_raw <= params.flow_min
    saturated_in_error_direction = (at_max and (error > 0)) or (at_min and (error < 0))
    if saturated_in_error_direction:
        return integral

    integral_new = integral + params.kp / params.ti_min * error * step_min
    return round(max(min(integral_new, INTEGRAL_LIMIT), -INTEGRAL_LIMIT), 3)


def demand_wanted(enabled: bool, switch_temp: float | None, params: Params) -> bool:
    """Heating is wanted below the summer threshold; unknown temperature means no."""
    if switch_temp is None:
        return False
    return enabled and (switch_temp < params.summer_temp)


def flow_setpoint(demand: bool, curve: float | None, room_correction: float, params: Params) -> int | None:
    """Rounded flow setpoint in [flow_min, flow_max]; 0 without demand; None without a curve."""
    if curve is None:
        return None
    if not demand:
        return 0
    flow_raw = curve + room_correction
    return round(max(min(flow_raw, params.flow_max), params.flow_min))


@dataclass(slots=True)
class DelayedSwitch:
    """Boolean that follows its input only after the input held for the delay.

    State kept between calls: current output and when the input started
    to differ from it.
    """

    state: bool | None = None
    pending_since: datetime | None = None
    delay_s: float = DEMAND_DELAY_S

    def update(self, wanted: bool, now: datetime) -> bool:
        # First evaluation (no restored state) takes the input directly.
        if self.state is None:
            self.state = wanted
            self.pending_since = None
            return self.state

        if wanted == self.state:
            self.pending_since = None
            return self.state

        if self.pending_since is None:
            self.pending_since = now
        held_s = (now - self.pending_since).total_seconds()
        if held_s >= self.delay_s:
            self.state = wanted
            self.pending_since = None
        return self.state
