"""Fixtures for tests that run the integration inside Home Assistant.

The pytest_homeassistant_custom_component plugin registers itself on install.
"""

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    return
