import os
import time
from typing import Dict, Optional

import requests

from .exceptions import ASTROAuthError, ASTROError, ASTRORateLimitError
from .models import AssetGate, AssetSnapshot, CompositeReading

DEFAULT_BASE_URL = "https://astro-event-horizon.vercel.app/api/signal"


class ASTRO:
    """
    Client for the A.S.T.R.O. Oracle API.

    Args:
        api_key: Your A.S.T.R.O. API key. Falls back to the ASTRO_API_KEY
            environment variable if not provided.
        base_url: Override the API base URL (useful for local testing
            against a mock server).
        timeout: Request timeout in seconds. Default 10.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = DEFAULT_BASE_URL,
        timeout: int = 10,
    ):
        self.api_key = api_key or os.environ.get("ASTRO_API_KEY")
        if not self.api_key:
            raise ASTROAuthError(
                "No API key provided. Pass api_key= or set ASTRO_API_KEY."
            )
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._session = requests.Session()
        self._session.headers.update({"X-API-Key": self.api_key})

    # -- internal -------------------------------------------------------

    def _get(self, path: str, params: Optional[Dict] = None) -> dict:
        url = f"{self.base_url}{path}"
        try:
            resp = self._session.get(url, params=params, timeout=self.timeout)
        except requests.RequestException as e:
            raise ASTROError(f"Network error calling {path}: {e}") from e

        if resp.status_code == 401:
            raise ASTROAuthError("Invalid or expired API key.")
        if resp.status_code == 429:
            retry_after = resp.headers.get("Retry-After")
            raise ASTRORateLimitError(
                "Rate limit exceeded — 1 request per 15-minute oracle cycle.",
                retry_after=int(retry_after) if retry_after else None,
            )
        if not resp.ok:
            raise ASTROError(f"ASTRO API error {resp.status_code}: {resp.text}")

        return resp.json()

    # -- public endpoints -------------------------------------------------

    def composite(self) -> CompositeReading:
        """GET /oracle/composite — composite score, regime, top movers."""
        data = self._get("/oracle/composite")
        return CompositeReading.from_dict(data)

    def signals(self) -> dict:
        """GET /oracle/signals — full per-domain signal breakdown."""
        return self._get("/oracle/signals")

    def assets(self) -> Dict[str, AssetSnapshot]:
        """GET /oracle/assets — per-asset ascendancy/velocity/gate snapshot."""
        data = self._get("/oracle/assets")
        return {sym: AssetSnapshot.from_dict(sym, v) for sym, v in data.items()}

    def gate(self, symbol: str) -> AssetGate:
        """GET /oracle/gate/:asset — full single-asset decision package."""
        data = self._get(f"/oracle/gate/{symbol.upper()}")
        return AssetGate.from_dict(symbol.upper(), data)

    def basket(self) -> dict:
        """GET /oracle/basket — full 10-asset scan in one call."""
        return self._get("/oracle/basket")

    def congress(self) -> dict:
        """GET /oracle/congress — congressional smart-money composite."""
        return self._get("/oracle/congress")

    def history(self, limit: int = 100) -> dict:
        """GET /oracle/history — historical oracle cycles with outcome tracking."""
        return self._get("/oracle/history", params={"limit": limit})

    def prices(self) -> dict:
        """GET /oracle/prices — live prices for all supported assets."""
        return self._get("/oracle/prices")

    def risk(self) -> dict:
        """GET /oracle/risk — risk mode, kelly multiplier, max positions."""
        return self._get("/oracle/risk")

    def regime(self) -> dict:
        """GET /oracle/regime — regime context, confluence, 4h trend, shift."""
        return self._get("/oracle/regime")

    # -- convenience ------------------------------------------------------

    def wait_for_next_cycle(self, poll_seconds: int = 30, max_wait: int = 900) -> CompositeReading:
        """
        Poll until last_updated changes, useful for scripts that want to
        react to each fresh oracle cycle rather than re-fetching stale data.
        """
        baseline = self.composite()
        waited = 0
        while waited < max_wait:
            time.sleep(poll_seconds)
            waited += poll_seconds
            reading = self.composite()
            if reading.last_updated != baseline.last_updated:
                return reading
        raise ASTROError("Timed out waiting for next oracle cycle.")
