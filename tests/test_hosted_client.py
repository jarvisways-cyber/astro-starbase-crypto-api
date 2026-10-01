from unittest.mock import patch
import pytest
import responses
from astro_intelligence import ASTRO, ASTROError, ASTROAuthError, ASTRORateLimitError

BASE = "https://astro-event-horizon.vercel.app"

@responses.activate
def test_one_resource_cycle_and_derived_views():
    fixtures = {
        "signal": {"composite": 0, "btc_price": None, "regime": "DEFENSIVE", "signals": {"fear_greed": 0}, "last_updated": "t1", "shift": None},
        "context": {"signal_explanation": {"base_composite": 0}, "quality": {"fallbacks_possible": True}},
        "basket": {"basket": {"BTC": {"gate": "BLOCKED", "ascendancy": None, "velocity": 0, "price": None, "stale": True}}, "last_updated": "t1"},
    }
    for resource, payload in fixtures.items():
        responses.get(f"{BASE}/api/{resource}", json=payload)
    with ASTRO(api_key="synthetic-test-key") as client:
        snapshot = client.snapshot()
        snapshot["basket"]["basket"]["BTC"]["gate"] = "OPEN"
        assert client.gate("btc").gate == "BLOCKED"
        assert client.assets()["BTC"].ascendancy is None
        assert client.assets()["BTC"].raw["stale"] is True
        assert client.composite().fear_greed == 0
        assert client.composite().raw["shift"] is None
        assert client.prices()["BTC"] is None
        assert len(responses.calls) == 3
        for call in responses.calls:
            assert call.request.headers["X-API-Key"] == "synthetic-test-key"
            assert "?" not in call.request.url

@responses.activate
def test_expired_cache_does_not_hide_failure_and_recovers():
    responses.get(f"{BASE}/api/context", json={"value": 1})
    responses.get(f"{BASE}/api/context", status=503, body="synthetic-test-key")
    responses.get(f"{BASE}/api/context", json={"value": 2})
    with patch("astro_intelligence.client.time.monotonic", return_value=0) as clock:
        client = ASTRO(api_key="synthetic-test-key")
        assert client.context()["value"] == 1
        clock.return_value = 899
        assert client.context()["value"] == 1
        clock.return_value = 901
        with pytest.raises(ASTROError) as error:
            client.context()
        assert "synthetic-test-key" not in str(error.value)
        assert client.context()["value"] == 2

@responses.activate
@pytest.mark.parametrize("retry,expected", [("120",120), ("bad",900), ("-4",0)])
def test_retry_after_and_redaction(retry, expected):
    responses.get(f"{BASE}/api/signal", status=429, headers={"Retry-After":retry}, body="synthetic-test-key")
    with pytest.raises(ASTRORateLimitError) as error:
        ASTRO(api_key="synthetic-test-key").signal()
    assert error.value.retry_after == expected
    assert "synthetic-test-key" not in str(error.value)

@responses.activate
def test_redirect_never_receives_key():
    responses.get(f"{BASE}/api/context", status=302, headers={"Location":"https://example.org/"})
    with pytest.raises(ASTROError):
        ASTRO(api_key="synthetic-test-key").context()
    assert len(responses.calls) == 1

@pytest.mark.parametrize("origin", ["http://example.org", BASE+"/api/signal", "https://user:pass@example.org", BASE+"?key=x"])
def test_invalid_origins(origin):
    with pytest.raises(ASTROError):
        ASTRO(api_key="synthetic-test-key", base_url=origin)

def test_header_injection():
    with pytest.raises(ASTROAuthError):
        ASTRO(api_key="bad\r\nX-Other: x")

@responses.activate
@pytest.mark.parametrize("payload", [[], {"basket": []}, {"basket":{"BTC":None}}])
def test_invalid_baskets(payload):
    responses.get(f"{BASE}/api/basket", json=payload)
    with pytest.raises(ASTROError):
        ASTRO(api_key="synthetic-test-key").basket()

@responses.activate
def test_invalid_json():
    responses.get(f"{BASE}/api/context", body="not-json")
    with pytest.raises(ASTROError):
        ASTRO(api_key="synthetic-test-key").context()

@responses.activate
def test_auth_failure_clears_cached_views():
    responses.get(f"{BASE}/api/signal", json={"composite": 1})
    responses.get(f"{BASE}/api/context", status=401)
    responses.get(f"{BASE}/api/signal", status=401)
    client=ASTRO(api_key="synthetic-test-key")
    client.signal()
    with pytest.raises(ASTROAuthError): client.context()
    with pytest.raises(ASTROAuthError): client.signal()

@responses.activate
def test_unknown_asset_and_unexposed_routes():
    responses.get(f"{BASE}/api/basket", json={"basket":{}})
    client=ASTRO(api_key="synthetic-test-key")
    with pytest.raises(ASTROError): client.gate("MISSING")
    for method in (client.history, client.risk, client.congress):
        with pytest.raises(ASTROError): method()
    assert len(responses.calls)==1

def test_poll_interval_enforced():
    with pytest.raises(ValueError):
        ASTRO(api_key="synthetic-test-key").wait_for_next_cycle(poll_seconds=30)
