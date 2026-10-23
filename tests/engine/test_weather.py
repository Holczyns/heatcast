from datetime import UTC, datetime, timedelta

import pytest
from engine.params import Params
from engine.weather import (
    ForecastHour,
    ForecastSummary,
    damp,
    forecast_is_valid,
    summarize_forecast,
    summarize_outdoor,
)

NOW = datetime(2026, 10, 23, 12, 20, tzinfo=UTC)


def hours(temps, clouds=None, winds=None, first=None):
    first = first or NOW.replace(minute=0)
    clouds = clouds or [50.0] * len(temps)
    winds = winds or [10.0] * len(temps)
    return [ForecastHour(first + timedelta(hours=i), temps[i], clouds[i], winds[i]) for i in range(len(temps))]


def test_damping_moves_towards_outdoor():
    assert damp(10.0, 2.0, step_min=5, tau_h=4) == pytest.approx(9.83)


def test_damping_holds_without_sensor():
    assert damp(10.0, None, step_min=5, tau_h=4) == 10.0


def test_damping_starts_from_outdoor():
    assert damp(None, 7.456, step_min=5, tau_h=4) == 7.46


def test_forecast_summary_over_horizon():
    rising = NOW.replace(hour=6) + timedelta(days=1)
    setting = NOW.replace(hour=15)
    summary = summarize_forecast(hours([8, 9, 10, 11, 12], winds=[10, 20, 30, 40, 0]), NOW, 4, rising, setting)
    assert summary.delta == 1.5
    assert summary.cloud == 50
    assert summary.wind == 25.0
    # middles at 12:30, 13:30, 14:30 are before sunset, 15:30 is after
    assert summary.daylight == 0.75


def test_forecast_skips_past_hours():
    rising = NOW.replace(hour=6) + timedelta(days=1)
    setting = NOW.replace(hour=18)
    past_first = NOW.replace(minute=0) - timedelta(hours=2)
    summary = summarize_forecast(hours([0, 0, 8, 10], first=past_first), NOW, 4, rising, setting)
    assert summary.delta == 1.0


def test_forecast_at_night():
    rising = NOW.replace(hour=13)
    setting = NOW.replace(hour=20)
    summary = summarize_forecast(hours([5, 5, 5, 5]), NOW, 4, rising, setting)
    # 12:30 is before sunrise, 13:30..15:30 after
    assert summary.daylight == 0.75


def test_forecast_empty():
    assert summarize_forecast([], NOW, 4, NOW, NOW) is None


def test_forecast_expires_after_three_hours():
    summary = ForecastSummary(0, 0, 0, 0, updated=NOW)
    assert forecast_is_valid(summary, NOW + timedelta(hours=2, minutes=59))
    assert not forecast_is_valid(summary, NOW + timedelta(hours=3))


def test_outdoor_without_forecast_uses_damped():
    outdoor = summarize_outdoor(8.0, 5.0, None, NOW, Params(k_solar=1, k_wind=1))
    assert outdoor.switch == 8.0
    assert outdoor.effective == 8.0
    assert outdoor.solar == 0
    assert outdoor.wind == 0


def test_outdoor_with_forecast_sun_and_wind():
    forecast = ForecastSummary(delta=-2.0, cloud=20, wind=25, daylight=0.5, updated=NOW)
    params = Params(forecast_weight=0.5, k_solar=1.0, k_wind=0.1, wind_ref=15)
    outdoor = summarize_outdoor(8.0, 6.0, forecast, NOW, params)
    assert outdoor.switch == 6.0
    assert outdoor.solar == 0.4
    assert outdoor.wind == 1.0
    assert outdoor.effective == pytest.approx(5.4)
    assert outdoor.forecast_effect == -2.0
