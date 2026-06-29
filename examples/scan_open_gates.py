"""
Scan the full 10-asset basket and print only the assets whose gate is
currently OPEN — useful as a building block for a bot's entry scanner.

Run:
    ASTRO_API_KEY=your-key python examples/scan_open_gates.py
"""

from astro_intelligence import ASTRO

SUPPORTED = ["BTC", "ETH", "SOL", "ADA", "DOGE", "LINK", "DOT", "POL", "ARB", "OP"]

client = ASTRO()

print("Scanning basket for open gates...\n")
open_assets = []

for symbol in SUPPORTED:
    gate = client.gate(symbol)
    flag = "OPEN " if gate.gate == "OPEN" else "blocked"
    print(f"  {symbol:5s} {flag:8s} asc={gate.ascendancy} vel={gate.velocity}")
    if gate.gate == "OPEN":
        open_assets.append(symbol)

print(f"\n{len(open_assets)} asset(s) open: {open_assets or 'none'}")
