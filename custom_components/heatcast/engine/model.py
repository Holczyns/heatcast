"""Control model: keeps the state between steps and evaluates all outputs.

State kept between steps, each for a reason:
- filtered room temperatures (the rate limiter needs its previous value),
- damped outdoor temperature (first-order lag),
- integral of the room correction,
- last forecast summary (result of a service call, not of an entity),
- heating demand with its switching delay.
Everything else is recomputed from the current inputs on every call.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from . import control, rooms, weather
from .params import STATE_STEP_MIN, Params


@dataclass(frozen=True, slots=True)
class Inputs:
    readings: dict[str, rooms.RoomReading]
    outdoor: float | None
    comfort_active: bool = False
    enabled: bool = True


@dataclass(frozen=True, slots=True)
class Snapshot:
    setpoint: float
    room: rooms.RoomSummary
    outdoor: weather.OutdoorSummary | None
    forecast_valid: bool
    curve: float | None
    p_term: float | None
    integral: float
    correction: float
    flow_raw: float | None
    demand_wanted: bool
    demand: bool
    flow: int | None
    room_targets: dict[str, float | None]


@dataclass(slots=True)
class ModelState:
    filtered: dict[str, float | None] = field(default_factory=dict)
    damped: float | None = None
    integral: float = 0.0
    forecast: weather.ForecastSummary | None = None
    demand: control.DelayedSwitch = field(default_factory=control.DelayedSwitch)

    def as_dict(self) -> dict[str, Any]:
        forecast = None
        if self.forecast is not None:
            forecast = {
                "delta": self.forecast.delta,
                "cloud": self.forecast.cloud,
                "wind": self.forecast.wind,
                "daylight": self.forecast.daylight,
                "updated": self.forecast.updated.isoformat(),
            }
        pending = self.demand.pending_since
        return {
            "filtered": dict(self.filtered),
            "damped": self.damped,
            "integral": self.integral,
            "forecast": forecast,
            "demand": self.demand.state,
            "demand_pending_since": pending.isoformat() if pending else None,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ModelState:
        forecast = None
        stored = data.get("forecast")
        if stored:
            forecast = weather.ForecastSummary(
                delta=stored["delta"],
                cloud=stored["cloud"],
                wind=stored["wind"],
                daylight=stored["daylight"],
                updated=datetime.fromisoformat(stored["updated"]),
            )
        pending = data.get("demand_pending_since")
        demand = control.DelayedSwitch(
            state=data.get("demand"),
            pending_since=datetime.fromisoformat(pending) if pending else None,
        )
        return cls(
            filtered=dict(data.get("filtered", {})),
            damped=data.get("damped"),
            integral=float(data.get("integral", 0.0)),
            forecast=forecast,
            demand=demand,
        )


class Model:
    def __init__(self, params: Params, room_configs: list[rooms.RoomConfig], state: ModelState | None = None) -> None:
        self.params = params
        self.rooms = room_configs
        self.state = state if state is not None else ModelState()

    def set_forecast(self, forecast: weather.ForecastSummary | None) -> None:
        """Store a new forecast; a failed fetch keeps the old one until it expires."""
        if forecast is not None:
            self.state.forecast = forecast

    def step(self, inputs: Inputs, now: datetime, step_min: float = STATE_STEP_MIN) -> Snapshot:
        """Advance filter, damping and integral by one fixed step, then evaluate."""
        params = self.params
        step_max = params.room_rate_max * step_min / 60.0
        hold_s = params.sensor_hold_min * 60.0
        for room in self.rooms:
            reading = inputs.readings.get(room.key, rooms.RoomReading(value=None, age_s=None))
            previous = self.state.filtered.get(room.key)
            self.state.filtered[room.key] = rooms.filter_step(reading, previous, step_max, hold_s)

        self.state.damped = weather.damp(self.state.damped, inputs.outdoor, step_min, params.damping_tau_h)

        # Integral uses error, demand and output computed from the values filtered above.
        before = self.evaluate(inputs, now)
        if before.flow_raw is not None:
            self.state.integral = control.integrate(
                self.state.integral,
                before.room.error,
                before.demand,
                before.flow_raw,
                step_min,
                params,
            )
        return self.evaluate(inputs, now)

    def evaluate(self, inputs: Inputs, now: datetime) -> Snapshot:
        params = self.params
        setpoint = control.house_setpoint(inputs.comfort_active, params)
        room = rooms.summarize(self.rooms, self.state.filtered, setpoint)
        outdoor = weather.summarize_outdoor(self.state.damped, inputs.outdoor, self.state.forecast, now, params)
        effective = outdoor.effective if outdoor is not None else None
        switch_temp = outdoor.switch if outdoor is not None else None

        curve = control.curve_flow(setpoint, effective, params)
        p_term = control.proportional(room.error, params)
        room_correction = control.correction(p_term, self.state.integral)

        wanted = control.demand_wanted(inputs.enabled, switch_temp, params)
        demand = self.state.demand.update(wanted, now)
        flow = control.flow_setpoint(demand, curve, room_correction, params)
        flow_raw = None
        if curve is not None:
            flow_raw = curve + room_correction

        return Snapshot(
            setpoint=setpoint,
            room=room,
            outdoor=outdoor,
            forecast_valid=weather.forecast_is_valid(self.state.forecast, now),
            curve=curve,
            p_term=p_term,
            integral=self.state.integral,
            correction=room_correction,
            flow_raw=flow_raw,
            demand_wanted=wanted,
            demand=demand,
            flow=flow,
            room_targets={config.key: rooms.room_target(setpoint, config) for config in self.rooms},
        )
