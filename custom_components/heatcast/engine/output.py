"""Decision what to send to the boiler; the integration is its only writer."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class OutputCommand:
    block_heating: bool | None = None
    """Desired state of the heating-off switch, None leaves it untouched."""
    flow: int | None = None
    """Flow setpoint to write, None writes nothing."""


RELEASE = OutputCommand(block_heating=False, flow=None)
"""Sent once when control is handed back to the boiler."""


def decide_output(
    control_active: bool,
    test_mode: bool,
    test_flow: int,
    demand: bool,
    flow: int | None,
    has_block_switch: bool,
    idle_flow: int,
) -> OutputCommand:
    """Single decision per cycle; the setpoint is re-sent every cycle as a keep-alive.

    Without a heating-off switch, no demand is expressed as idle_flow.
    Without a result from the model nothing is sent, so the boiler falls
    back to its own control after its timeout.
    """
    block_off = False if has_block_switch else None

    if test_mode:
        return OutputCommand(block_heating=block_off, flow=test_flow)
    if not control_active:
        return OutputCommand()
    if not demand and has_block_switch:
        return OutputCommand(block_heating=True)
    if not demand:
        return OutputCommand(flow=idle_flow)
    if flow is None:
        return OutputCommand()
    return OutputCommand(block_heating=block_off, flow=flow)
