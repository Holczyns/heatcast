from datetime import datetime, timedelta

from engine.faults import Fault, FaultInputs, FaultMonitor, conditions, undetermined

START = datetime(2026, 1, 15, 6, 0)


def inputs(**overrides):
    values = {
        "control_active": True,
        "written_flow": 30,
        "boiler_flow": 30.0,
        "hot_water": False,
        "has_rooms": True,
        "coverage": 1.0,
        "outdoor": 2.0,
        "measured_flow": 31.0,
        "flow_max": 45.0,
    }
    values.update(overrides)
    return FaultInputs(**values)


def test_healthy_scan_has_no_condition():
    assert conditions(inputs()) == set()


def test_boiler_with_other_setpoint_is_not_accepting():
    assert conditions(inputs(boiler_flow=22.0)) == {Fault.SETPOINT_NOT_ACCEPTED}


def test_unavailable_boiler_setpoint_is_not_accepting():
    assert conditions(inputs(boiler_flow=None)) == {Fault.SETPOINT_NOT_ACCEPTED}


def test_setpoint_ignored_during_hot_water_and_without_write():
    assert conditions(inputs(boiler_flow=60.0, hot_water=True)) == set()
    assert conditions(inputs(boiler_flow=22.0, written_flow=None)) == set()


def test_low_coverage_counts_only_with_rooms():
    assert conditions(inputs(coverage=0.25)) == {Fault.ROOM_SENSORS_LOST}
    assert conditions(inputs(coverage=0.0, has_rooms=False)) == set()


def test_missing_outdoor_temperature():
    assert conditions(inputs(outdoor=None)) == {Fault.OUTDOOR_LOST}


def test_flow_too_high_only_while_controlling_space_heating():
    assert conditions(inputs(measured_flow=56.0)) == {Fault.FLOW_TOO_HIGH}
    assert conditions(inputs(measured_flow=55.0)) == set()
    assert conditions(inputs(measured_flow=70.0, hot_water=True, boiler_flow=70.0, written_flow=None)) == set()
    assert conditions(inputs(measured_flow=70.0, control_active=False, written_flow=None)) == set()


def test_fault_raised_after_delay_and_cleared_at_once():
    monitor = FaultMonitor()
    present = {Fault.SETPOINT_NOT_ACCEPTED}
    assert monitor.update(present, START) == (set(), set())
    assert monitor.update(present, START + timedelta(minutes=2, seconds=30)) == (set(), set())
    assert monitor.update(present, START + timedelta(minutes=3)) == (present, set())
    assert monitor.update(present, START + timedelta(minutes=3, seconds=30)) == (set(), set())
    assert monitor.update(set(), START + timedelta(minutes=4)) == (set(), present)
    assert monitor.active == set()


def test_interrupted_condition_starts_its_delay_again():
    monitor = FaultMonitor()
    present = {Fault.SETPOINT_NOT_ACCEPTED}
    monitor.update(present, START)
    monitor.update(set(), START + timedelta(minutes=2))
    monitor.update(present, START + timedelta(minutes=2, seconds=30))
    assert monitor.update(present, START + timedelta(minutes=5)) == (set(), set())
    assert monitor.update(present, START + timedelta(minutes=5, seconds=30)) == (present, set())


def test_hot_water_neither_clears_nor_raises():
    monitor = FaultMonitor()
    present = {Fault.SETPOINT_NOT_ACCEPTED}
    hot_water = undetermined(inputs(hot_water=True))
    monitor.update(present, START)
    assert monitor.update(present, START + timedelta(minutes=3)) == (present, set())
    # Hot water: the boiler reports its own setpoint, the reported fault stays.
    assert monitor.update(set(), START + timedelta(minutes=4), hot_water) == (set(), set())
    assert monitor.active == present
    # Still not accepted after hot water: no second notification.
    assert monitor.update(present, START + timedelta(minutes=6)) == (set(), set())


def test_condition_starting_during_hot_water_waits_for_it_to_end():
    monitor = FaultMonitor()
    hot_water = undetermined(inputs(hot_water=True))
    assert monitor.update(set(), START, hot_water) == (set(), set())
    assert monitor.update({Fault.SETPOINT_NOT_ACCEPTED}, START + timedelta(minutes=1)) == (set(), set())
    assert monitor.update({Fault.SETPOINT_NOT_ACCEPTED}, START + timedelta(minutes=4)) == (
        {Fault.SETPOINT_NOT_ACCEPTED},
        set(),
    )
