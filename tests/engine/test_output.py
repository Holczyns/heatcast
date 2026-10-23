from engine.output import OutputCommand, decide_output


def decide(**overrides):
    args = {
        "control_active": True,
        "test_mode": False,
        "test_flow": 30,
        "demand": True,
        "flow": 27,
        "has_block_switch": True,
        "idle_flow": 0,
    }
    args.update(overrides)
    return decide_output(**args)


def test_heating_sends_setpoint_and_unblocks():
    assert decide() == OutputCommand(block_heating=False, flow=27)


def test_shadow_mode_sends_nothing():
    assert decide(control_active=False) == OutputCommand()


def test_no_demand_blocks_heating():
    assert decide(demand=False) == OutputCommand(block_heating=True)


def test_no_demand_without_switch_sends_idle_flow():
    assert decide(demand=False, has_block_switch=False) == OutputCommand(flow=0)


def test_missing_result_sends_nothing():
    assert decide(flow=None) == OutputCommand()


def test_test_mode_overrides_everything():
    assert decide(control_active=False, demand=False, test_mode=True) == OutputCommand(block_heating=False, flow=30)


def test_without_switch_only_flow_is_sent():
    assert decide(has_block_switch=False) == OutputCommand(flow=27)
