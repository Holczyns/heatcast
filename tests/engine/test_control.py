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
    proportional,
)
from engine.params import Params

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
    assert integrate(0.0, 1.0, True, 30.0, 5, PARAMS) == pytest.approx(0.06)


def test_integral_locks():
    assert integrate(1.0, None, True, 30.0, 5, PARAMS) == 1.0
    assert integrate(1.0, 1.0, False, 30.0, 5, PARAMS) == 1.0
    # output at minimum and room too warm: integrating further would wind up
    assert integrate(-1.0, -0.5, True, 22.0, 5, PARAMS) == -1.0
    # output at minimum but room too cold: allowed to recover
    assert integrate(-1.0, 0.5, True, 22.0, 5, PARAMS) == pytest.approx(-0.97)


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
