"""Replay recorded history through the model.

The fixture holds about eight hours of a house controlled by the YAML
implementation this model replaces: raw inputs, its parameters, the state
it stored every five minutes and the values it derived. The model runs
open-loop from the first recorded state and has to track the recording.
"""

from __future__ import annotations

import json
from bisect import bisect_right
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path

import pytest
from engine.control import DelayedSwitch
from engine.model import Inputs, Model, ModelState
from engine.params import Params
from engine.rooms import RoomConfig, RoomReading
from engine.weather import ForecastSummary

FIXTURE = Path(__file__).parents[1] / "fixtures" / "replay_2026-10-23.json"
ROOMS = ["living_room", "kids_room", "bedroom"]
STEP = timedelta(minutes=5)
# The recorded implementation writes its state and re-renders derived values
# within a second after each tick; the forecast is fetched on the same tick.
SETTLE = timedelta(seconds=5)
# Home Assistant was restarting at this tick, the recording has no step for it.
MISSED_TICKS = {"2026-10-23T17:55:00+02:00"}

PARAM_FIELDS = {
    "comfort_temp": "comfort_temp",
    "room_rate_max": "room_rate_max",
    "sensor_hold_min": "sensor_hold_min",
    "damping_tau_h": "damping_tau_h",
    "forecast_horizon_h": "fc_horizon_h",
    "forecast_weight": "fc_weight",
    "k_solar": "k_solar",
    "k_wind": "k_wind",
    "wind_ref": "wind_ref",
    "kp": "kp",
    "ti_min": "ti_min",
    "design_temp": "design_temp",
    "outdoor_min": "out_min",
    "curve_exponent": "curve_exp",
    "curve_offset": "curve_offset",
    "summer_temp": "summer_temp",
    "flow_min": "flow_min",
    "flow_max": "flow_max",
}


@dataclass
class Series:
    times: list[datetime]
    states: list[str]

    def at(self, moment: datetime) -> tuple[str | None, datetime | None]:
        index = bisect_right(self.times, moment) - 1
        if index < 0:
            return None, None
        return self.states[index], self.times[index]

    def number(self, moment: datetime) -> float | None:
        state, _ = self.at(moment)
        try:
            return float(state)
        except (TypeError, ValueError):
            return None


def load() -> dict[str, Series]:
    raw = json.loads(FIXTURE.read_text(encoding="utf-8"))
    return {
        name: Series([datetime.fromisoformat(row[0]) for row in rows], [row[1] for row in rows])
        for name, rows in raw.items()
    }


def reading(series: Series, moment: datetime) -> RoomReading:
    state, changed = series.at(moment)
    try:
        return RoomReading(value=float(state))
    except (TypeError, ValueError):
        return RoomReading(value=None, age_s=None, missing_s=(moment - changed).total_seconds())


def forecast_at(history: dict[str, Series], moment: datetime) -> ForecastSummary | None:
    updated, _ = history["input_datetime.fc_updated"].at(moment)
    if updated is None:
        return None
    # input_datetime stores local time without an offset.
    updated_at = datetime.fromisoformat(updated).replace(tzinfo=moment.tzinfo)
    return ForecastSummary(
        delta=history["input_number.fc_delta"].number(moment),
        cloud=history["input_number.fc_cloud"].number(moment),
        wind=history["input_number.fc_wind"].number(moment),
        daylight=history["input_number.fc_daylight"].number(moment),
        updated=updated_at,
    )


def params_at(history: dict[str, Series], moment: datetime) -> Params:
    values = {field: history["input_number." + name].number(moment) for field, name in PARAM_FIELDS.items()}
    # The recorded implementation stored eco as an absolute temperature.
    values["eco_offset"] = history["input_number.eco_temp"].number(moment) - values["comfort_temp"]
    return Params(**values)


def rooms_at(history: dict[str, Series], moment: datetime) -> list[RoomConfig]:
    """The recorded room offsets become individual room targets."""
    comfort = history["input_number.comfort_temp"].number(moment)
    return [
        RoomConfig(
            key,
            weight=history["input_number.weight_" + key].number(moment),
            target=comfort + (history["input_number.offset_" + key].number(moment) or 0.0),
        )
        for key in ROOMS
    ]


def first_tick(history: dict[str, Series]) -> datetime:
    start = history["input_number.outdoor_damped"].times[0]
    tick = start.replace(second=0, microsecond=0)
    tick += timedelta(minutes=(5 - tick.minute % 5) % 5 or 5)
    return tick


@pytest.fixture(scope="module")
def replay():
    history = load()
    tick = first_tick(history)
    end = history["sensor.outdoor"].times[-1]

    before = tick - timedelta(seconds=1)
    state = ModelState(
        filtered={key: history["input_number.filtered_" + key].number(before) for key in ROOMS},
        damped=history["input_number.outdoor_damped"].number(before),
        integral=history["input_number.integral"].number(before),
        demand=DelayedSwitch(state=history["binary_sensor.demand"].at(before)[0] == "on"),
    )
    model = Model(params_at(history, tick), rooms_at(history, tick), state)

    rows = []
    while tick <= end:
        model.params = params_at(history, tick)
        model.rooms = rooms_at(history, tick)
        if tick.isoformat() in MISSED_TICKS:
            tick += STEP
            continue
        model.state.forecast = forecast_at(history, tick + SETTLE)
        inputs = Inputs(
            readings={key: reading(history["sensor." + key], tick) for key in ROOMS},
            outdoor=history["sensor.outdoor"].number(tick),
            comfort_active=history["schedule.comfort"].at(tick)[0] == "on",
            enabled=history["input_boolean.enabled"].at(tick)[0] == "on",
            synchronised=False,
        )
        snapshot = model.step(inputs, tick)
        settled = tick + SETTLE
        rows.append((tick, snapshot, dict(model.state.filtered), model.state.damped, history, settled))
        tick += STEP
    return rows


def test_replay_covers_the_recording(replay):
    assert len(replay) > 70


def test_filtered_room_temperatures_track_recording(replay):
    for tick, _, filtered, _, history, settled in replay:
        for key in ROOMS:
            recorded = history["input_number.filtered_" + key].number(settled)
            model = filtered[key]
            if (recorded is None) or (recorded < -39):
                assert model is None, (tick, key)
                continue
            assert model == pytest.approx(recorded, abs=0.005), (tick, key)


def test_damped_outdoor_tracks_recording(replay):
    for tick, _, _, damped, history, settled in replay:
        assert damped == pytest.approx(history["input_number.outdoor_damped"].number(settled), abs=0.005), tick


def test_derived_values_track_recording(replay):
    for tick, snapshot, _, _, history, settled in replay:
        assert snapshot.room.error == pytest.approx(history["sensor.room_error"].number(settled), abs=0.005), tick
        assert snapshot.curve == pytest.approx(history["sensor.curve_flow"].number(settled), abs=0.005), tick
        assert snapshot.flow == history["sensor.flow_setpoint"].number(settled), tick
        assert snapshot.integral == pytest.approx(history["input_number.integral"].number(settled), abs=0.005), tick
