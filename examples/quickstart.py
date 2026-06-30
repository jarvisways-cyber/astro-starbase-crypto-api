"""
Basic usage: fetch the current oracle composite reading and check
whether BTC's gate is open.

Run:
    ASTRO_API_KEY=your-key python examples/quickstart.py
"""

from astro_intelligence import ASTRO, ASTROError

client = ASTRO()  # reads ASTRO_API_KEY from env if not passed explicitly

try:
    reading = client.composite()
    print(f"Regime:     {reading.regime}")
    print(f"Composite:  {reading.composite}")
    print(f"Fear&Greed: {reading.fear_greed}")
    print(f"BTC price:  ${reading.btc_price:,.2f}")
    print(f"Updated:    {reading.last_updated}")

    btc_gate = client.gate("BTC")
    print(f"\nBTC gate:   {btc_gate.gate} (strategy={btc_gate.strategy}, confidence={btc_gate.confidence})")

except ASTROError as e:
    print(f"ASTRO API error: {e}")
