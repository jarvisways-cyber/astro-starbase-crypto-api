"""Client for the three supported hosted ASTRO resources."""
import copy
import os
import time
from typing import Dict, Optional
from urllib.parse import urlsplit

import requests

from .exceptions import ASTROAuthError, ASTROError, ASTRORateLimitError
from .models import AssetGate, AssetSnapshot, CompositeReading

DEFAULT_BASE_URL = "https://astro-event-horizon.vercel.app"
POLL_INTERVAL = 900


class ASTRO:
    """Header-authenticated hosted client with a per-resource 900-second cache.

    Cache timestamps are acquisition times, NOT proof of source freshness.
    Reuse one instance across derived views. Separate processes share server
    rate limits but not this cache. No expired data is returned on refresh error.
    """

    def __init__(self, api_key: Optional[str] = None,
                 base_url: str = DEFAULT_BASE_URL, timeout: int = 20):
        key = api_key or os.environ.get("ASTRO_API_KEY")
        if not isinstance(key, str) or not key.strip():
            raise ASTROAuthError("An API key is required.")
        if any(ord(c) < 33 or ord(c) > 126 for c in key):
            raise ASTROAuthError("API key contains invalid header characters.")
        parsed = urlsplit(base_url)
        if (parsed.scheme != "https" or not parsed.hostname or parsed.username
                or parsed.password or parsed.query or parsed.fragment
                or parsed.path not in ("", "/")):
            raise ASTROError("base_url must be an HTTPS origin, without a path or credentials.")
        if timeout <= 0:
            raise ValueError("timeout must be positive")
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._session = requests.Session()
        self._session.headers.update({"X-API-Key": key})
        self._cache = {}

    def _get(self, resource: str) -> dict:
        cached = self._cache.get(resource)
        if cached and time.monotonic() - cached[0] < POLL_INTERVAL:
            return copy.deepcopy(cached[1])
        try:
            response = self._session.get(
                f"{self.base_url}/api/{resource}", timeout=self.timeout,
                allow_redirects=False,
            )
        except requests.RequestException:
            raise ASTROError("API network request failed; no cached fallback returned.") from None
        try:
            status = response.status_code
            if status in (401, 403):
                self._cache.clear()
                raise ASTROAuthError("API access was rejected.")
            if status == 429:
                retry = response.headers.get("Retry-After", "")
                try:
                    delay = max(0, int(retry))
                except (ValueError, TypeError):
                    delay = POLL_INTERVAL
                raise ASTRORateLimitError(
                    "Resource rate limit reached; wait before retrying.", delay)
            if status != 200:
                raise ASTROError(f"API returned HTTP {status}; redirects are not followed.")
            try:
                data = response.json()
            except ValueError:
                raise ASTROError("API returned invalid JSON.") from None
            if not isinstance(data, dict):
                raise ASTROError("API response must be a JSON object.")
            if resource == "basket" and (not isinstance(data.get("basket"), dict)
                    or any(not isinstance(v, dict) for v in data["basket"].values())):
                raise ASTROError("API basket must map symbols to objects.")
            self._cache[resource] = (time.monotonic(), copy.deepcopy(data))
            return data
        finally:
            response.close()

    def signal(self) -> dict:
        """Raw signal, including additive fields and observation metadata."""
        return self._get("signal")

    def context(self) -> dict:
        """Raw component explanations, market rankings and auxiliary intelligence."""
        return self._get("context")

    def basket(self) -> dict:
        """Raw basket envelope, including quotes, gates, quality and timestamps."""
        return self._get("basket")

    def snapshot(self) -> dict:
        """Fetch each resource once; sequential reads are not an atomic snapshot."""
        return {"signal": self.signal(), "context": self.context(), "basket": self.basket()}

    def composite(self) -> CompositeReading:
        return CompositeReading.from_dict(self.signal())

    def signals(self) -> dict:
        return self.signal().get("signals", {})

    def assets(self) -> Dict[str, AssetSnapshot]:
        return {symbol: AssetSnapshot.from_dict(symbol, value)
                for symbol, value in self.basket()["basket"].items()}

    def gate(self, symbol: str) -> AssetGate:
        data = self.basket()
        symbol = symbol.upper()
        if symbol not in data["basket"]:
            raise ASTROError("Asset is unavailable in the returned basket.")
        value = dict(data["basket"][symbol])
        value.setdefault("regime", data.get("regime"))
        return AssetGate.from_dict(symbol, value)

    def prices(self) -> dict:
        """Prices only; use basket() for quote observation and stale flags."""
        return {symbol: value.get("price") for symbol, value in self.basket()["basket"].items()}

    def regime(self) -> dict:
        """Context view, not a request to an unexposed backend route."""
        return self.context()

    def congress(self) -> dict:
        raise ASTROError("Dedicated congress detail is not exposed by the hosted routes; use context().")

    def history(self, limit: int = 100) -> dict:
        raise ASTROError("History is not exposed through the documented hosted routes.")

    def risk(self) -> dict:
        raise ASTROError("Private execution risk is not exposed through the hosted routes.")

    def wait_for_next_cycle(self, poll_seconds: int = POLL_INTERVAL,
                            max_wait: int = POLL_INTERVAL) -> CompositeReading:
        if poll_seconds < POLL_INTERVAL or max_wait < poll_seconds:
            raise ValueError("Poll interval must be at least 900 seconds and fit max_wait.")
        baseline = self.composite()
        waited = 0
        while waited + poll_seconds <= max_wait:
            time.sleep(poll_seconds)
            waited += poll_seconds
            reading = self.composite()
            if reading.last_updated and reading.last_updated != baseline.last_updated:
                return reading
        raise ASTROError("Timed out waiting for a new observation.")

    def close(self):
        self._cache.clear()
        self._session.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
