"""
Unit tests for the astro_intelligence client.
These mock HTTP responses — no live API key or network access required.

Run:
    pip install -e ".[dev]"
    pytest
"""

import pytest
import responses

from astro_intelligence import ASTRO, ASTROAuthError, ASTRORateLimitError

BASE_URL = "https://astro-event-horizon.vercel.app/api/signal"


@pytest.fixture
def client():
    return ASTRO(api_key="test-key")


def test_requires_api_key():
    with pytest.raises(ASTROAuthError):
        ASTRO(api_key=None)


@responses.activate
def test_composite(client):
    responses.add(
        responses.GET,
        f"{BASE_URL}/oracle/composite",
        json={
            "composite": 53.18,
            "regime": "BEAR_ACCUMULATION",
            "btc_price": 59441.40,
            "signals": {"fear_greed": 34.0},
            "watching": [],
            "last_updated": "2026-06-28T20:06:47Z",
        },
        status=200,
    )
    reading = client.composite()
    assert reading.regime == "BEAR_ACCUMULATION"
    assert reading.composite == 53.18
    assert reading.fear_greed == 34.0


@responses.activate
def test_gate_open(client):
    responses.add(
        responses.GET,
        f"{BASE_URL}/oracle/gate/BTC",
        json={
            "gate": "OPEN",
            "strategy": "CANDLE_REVERSAL",
            "confidence": 0.847,
            "ascendancy": 43.1,
            "velocity": 9.3,
        },
        status=200,
    )
    gate = client.gate("btc")
    assert gate.symbol == "BTC"
    assert gate.gate == "OPEN"
    assert gate == "OPEN"  # __eq__ convenience


@responses.activate
def test_auth_error(client):
    responses.add(
        responses.GET,
        f"{BASE_URL}/oracle/composite",
        json={"error": "Invalid or expired API key."},
        status=401,
    )
    with pytest.raises(ASTROAuthError):
        client.composite()


@responses.activate
def test_rate_limit_error(client):
    responses.add(
        responses.GET,
        f"{BASE_URL}/oracle/composite",
        json={"error": "Rate limit exceeded."},
        status=429,
        headers={"Retry-After": "120"},
    )
    with pytest.raises(ASTRORateLimitError) as exc_info:
        client.composite()
    assert exc_info.value.retry_after == 120
