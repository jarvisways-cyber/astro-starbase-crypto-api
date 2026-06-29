"""
astro_intelligence
-------------------
Lightweight Python client for the A.S.T.R.O. Oracle API.

Usage:
    from astro_intelligence import ASTRO

    client = ASTRO(api_key="your-key")
    reading = client.composite()
    print(reading.regime, reading.composite)
"""

from .client import ASTRO
from .models import CompositeReading, AssetGate, AssetSnapshot
from .exceptions import ASTROError, ASTROAuthError, ASTRORateLimitError

__all__ = [
    "ASTRO",
    "CompositeReading",
    "AssetGate",
    "AssetSnapshot",
    "ASTROError",
    "ASTROAuthError",
    "ASTRORateLimitError",
]

__version__ = "0.1.0"
