import pytest
from engine.rooms import RoomConfig, RoomReading, filter_step, room_targets, summarize

STEP = 0.4 * 5 / 60
HOLD_S = 30 * 60


def test_filter_limits_fast_change():
    assert filter_step(RoomReading(22.0), 21.0, STEP, HOLD_S) == pytest.approx(21.03)


def test_filter_passes_slow_change():
    assert filter_step(RoomReading(21.02), 21.0, STEP, HOLD_S) == 21.02


def test_filter_starts_from_raw_value():
    assert filter_step(RoomReading(21.37), None, STEP, HOLD_S) == 21.37


def test_filter_resynchronises_after_invalid_period():
    assert filter_step(RoomReading(23.0), -40.0, STEP, HOLD_S) == 23.0


def test_filter_rejects_implausible_reading():
    assert filter_step(RoomReading(55.0), 21.0, STEP, HOLD_S) is None


def test_filter_rejects_stale_reading():
    assert filter_step(RoomReading(21.0, age_s=3600), 21.0, STEP, HOLD_S) is None


def test_filter_holds_value_during_short_dropout():
    reading = RoomReading(None, age_s=None, missing_s=600)
    assert filter_step(reading, 21.4, STEP, HOLD_S) == 21.4


def test_filter_drops_room_after_long_dropout():
    reading = RoomReading(None, age_s=None, missing_s=HOLD_S)
    assert filter_step(reading, 21.4, STEP, HOLD_S) is None


def test_filter_does_not_hold_without_previous_value():
    reading = RoomReading(None, age_s=None, missing_s=60)
    assert filter_step(reading, None, STEP, HOLD_S) is None


ROOMS = [
    RoomConfig("living", weight=0.25, target=21.0),
    RoomConfig("kids", weight=0.5),
    RoomConfig("bedroom", weight=0.25),
]
TARGETS = {"living": 21.0, "kids": 20.0, "bedroom": 20.0}


def test_summary_weights_rooms_and_offsets():
    summary = summarize(ROOMS, {"living": 21.0, "kids": 20.0, "bedroom": 19.0}, TARGETS)
    assert summary.temperature == 20.0
    assert summary.coverage == 1.0
    # living: 21 - 21 = 0, kids: 0, bedroom: +1
    assert summary.error == pytest.approx(0.25)


def test_summary_skips_invalid_room_and_rescales():
    summary = summarize(ROOMS, {"living": 21.0, "kids": 20.0, "bedroom": None}, TARGETS)
    assert summary.coverage == 0.75
    assert summary.temperature == pytest.approx(20.3)


def test_summary_unavailable_below_half_coverage():
    summary = summarize(ROOMS, {"living": 21.0, "kids": None, "bedroom": 19.0}, TARGETS)
    assert summary.coverage == 0.5
    assert summary.temperature == 20.0

    summary = summarize(ROOMS, {"living": 21.0, "kids": None, "bedroom": None}, TARGETS)
    assert summary.coverage == 0.25
    assert summary.temperature is None
    assert summary.error is None


def test_room_with_zero_weight_is_ignored():
    rooms = [RoomConfig("a", weight=1.0), RoomConfig("b", weight=0.0)]
    summary = summarize(rooms, {"a": 20.0, "b": 30.0}, {"a": 20.0, "b": 20.0})
    assert summary.temperature == 20.0
    assert summary.coverage == 1.0


def test_synchronised_rooms_follow_house():
    assert room_targets(ROOMS, 20.5, 0.0, synchronised=True) == {"living": 20.5, "kids": 20.5, "bedroom": 20.5}


def test_individual_rooms_keep_own_target():
    targets = room_targets(ROOMS, 20.5, 0.0, synchronised=False)
    # rooms without an own target fall back to the house value
    assert targets == {"living": 21.0, "kids": 20.5, "bedroom": 20.5}


def test_eco_shifts_every_target():
    assert room_targets(ROOMS, 20.0, -1.0, synchronised=False)["living"] == 20.0
    assert room_targets(ROOMS, 20.0, -1.0, synchronised=True)["kids"] == 19.0
