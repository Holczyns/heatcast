from datetime import UTC, datetime, timedelta

import pytest
from engine.control import (
    DelayedSwitch,
    correction,
    curve_flow,
    demand_wanted,
    eco_shift,
    flow_setpoint,
    integrate,
    low_load,
    proportional,
    pump_stop,
)
from engine.model import Inputs, Model, ModelState
from engine.params import Params
from engine.rooms import RoomConfig, RoomReading

PARAMS = Params()
NOW = datetime(2026, 10, 23, 12, 0, tzinfo=UTC)


def test_eco_setback_applies_outside_schedule():
    params = Params(eco_offset=-1.5)
    assert eco_shift(True, params) == 0
    assert eco_shift(False, params) == -1.5


@pytest.mark.parametrize(
    ("effective", "expected"),
    # Reference values rendered by the Home Assistant template the model replaces.
    [(5.3, 27.54), (7.0, 26.59), (10.0, 24.87), (20.0, 18.5), (25.0, 18.5)],
)
def test_curve_matches_reference_points(effective, expected):
    assert curve_flow(20.0, effective, PARAMS) == pytest.approx(expected, abs=0.01)


def test_curve_reaches_design_temperature():
    assert curve_flow(20.0, -25.0, Params(curve_offset=0)) == 45.0


def test_curve_unavailable_without_inputs():
    assert curve_flow(None, 5.0, PARAMS) is None
    assert curve_flow(20.0, None, PARAMS) is None


def test_proportional_is_limited():
    assert proportional(0.5, PARAMS) == 1.5
    assert proportional(-2.0, PARAMS) == -3.0
    assert proportional(None, PARAMS) is None


def test_correction_needs_room_error():
    assert correction(1.5, -0.5) == 1.0
    assert correction(None, -3.0) == 0.0


def test_integral_accumulates():
    assert integrate(0.0, 0.2, True, 30.0, 5, PARAMS) == pytest.approx(0.012)


def test_integral_counts_limited_error():
    # airing: a large error advances the integral no faster than the error limit
    assert integrate(0.0, 2.0, True, 30.0, 5, PARAMS) == pytest.approx(0.018)
    assert integrate(0.0, -2.0, True, 30.0, 5, PARAMS) == pytest.approx(-0.018)


def test_integral_locks():
    assert integrate(1.0, None, True, 30.0, 5, PARAMS) == 1.0
    assert integrate(1.0, 1.0, False, 30.0, 5, PARAMS) == 1.0
    # output at minimum and room too warm: integrating further would wind up
    assert integrate(-1.0, -0.5, True, 22.0, 5, PARAMS) == -1.0
    # output at minimum but room too cold: allowed to recover
    assert integrate(-1.0, 0.5, True, 22.0, 5, PARAMS) == pytest.approx(-0.982)


def test_integral_is_limited():
    assert integrate(2.99, 5.0, True, 30.0, 5, PARAMS) == 3.0


def test_demand_below_summer_threshold():
    assert demand_wanted(True, 11.9, PARAMS)
    assert not demand_wanted(True, 12.0, PARAMS)
    assert not demand_wanted(False, 5.0, PARAMS)
    assert not demand_wanted(True, None, PARAMS)


def test_flow_setpoint_limits_and_rounds():
    assert flow_setpoint(True, 26.59, -3.0, PARAMS) == 24
    assert flow_setpoint(True, 24.0, -3.0, PARAMS) == 22
    assert flow_setpoint(True, 44.0, 3.0, PARAMS) == 45
    assert flow_setpoint(False, 30.0, 0.0, PARAMS) == 0
    assert flow_setpoint(True, None, 0.0, PARAMS) is None


def test_delayed_switch_waits_for_stable_input():
    switch = DelayedSwitch(state=False)
    assert not switch.update(True, NOW)
    assert not switch.update(True, NOW + timedelta(minutes=29))
    assert switch.update(True, NOW + timedelta(minutes=30))


def test_delayed_switch_restarts_after_flicker():
    switch = DelayedSwitch(state=False)
    switch.update(True, NOW)
    switch.update(False, NOW + timedelta(minutes=20))
    assert not switch.update(True, NOW + timedelta(minutes=40))
    assert switch.update(True, NOW + timedelta(minutes=70))


def test_delayed_switch_takes_first_value():
    assert DelayedSwitch().update(True, NOW)


def test_low_load_starts_at_minimum_and_ends_two_kelvin_above():
    assert low_load(False, 22.4, PARAMS) is False
    assert low_load(False, 22.0, PARAMS) is True
    assert low_load(True, 23.9, PARAMS) is True
    assert low_load(True, 24.0, PARAMS) is False
    assert low_load(True, None, PARAMS) is False


def test_pump_stops_once_flow_reaches_rooms_and_waits_for_end_of_low_load():
    assert pump_stop(False, True, 23.5, 21.0) is False
    assert pump_stop(False, True, 23.0, 21.0) is True
    assert pump_stop(True, True, 30.0, 21.0) is True
    assert pump_stop(True, False, 20.0, 21.0) is False
    assert pump_stop(False, True, None, 21.0) is False


def _model(room: float, low_load_active: bool, measured_flow: float | None = None) -> tuple[Model, Inputs]:
    state = ModelState(low_load=low_load_active)
    model = Model(Params(comfort_temp=21.0, curve_offset=-3.0), [RoomConfig(key="room")], state)
    inputs = Inputs(
        readings={"room": RoomReading(value=room)}, outdoor=10.0, comfort_active=True, measured_flow=measured_flow
    )
    model.prime(inputs)
    return model, inputs


def test_model_sends_low_load_flow_to_warm_house():
    model, inputs = _model(22.5, low_load_active=False, measured_flow=25.0)
    snapshot = model.step(inputs, NOW)
    assert snapshot.demand is True
    assert snapshot.low_load is True
    assert snapshot.pump_stop is False
    assert snapshot.flow == 10


def test_model_stops_pump_once_flow_reaches_rooms():
    model, inputs = _model(22.5, low_load_active=True, measured_flow=23.0)
    snapshot = model.step(inputs, NOW)
    assert snapshot.pump_stop is True
    assert snapshot.flow == 0


def test_model_ends_low_load_in_cold_house():
    model, inputs = _model(19.5, low_load_active=True, measured_flow=20.0)
    snapshot = model.step(inputs, NOW)
    assert snapshot.low_load is False
    assert snapshot.pump_stop is False
    assert snapshot.flow >= 24


def test_low_load_survives_restart():
    state = ModelState.from_dict(ModelState(low_load=True, pump_stop=True).as_dict())
    assert (state.low_load, state.pump_stop) == (True, True)
