"""
Long-running example: poll the oracle and append each new composite
reading to a local CSV — a minimal version of what ASTRO's own
history-logging does internally, useful for your own auditing.

Run:
    ASTRO_API_KEY=your-key python examples/poll_and_log.py
"""

import csv
import os
import time

from astro_intelligence import ASTRO, ASTROError

OUTPUT_FILE = "astro_composite_log.csv"

client = ASTRO()

if not os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, "w", newline="") as f:
        csv.writer(f).writerow(["last_updated", "composite", "regime", "btc_price"])

print("Polling A.S.T.R.O. — Ctrl+C to stop")

last_seen = None
while True:
    try:
        reading = client.composite()
        if reading.last_updated != last_seen:
            with open(OUTPUT_FILE, "a", newline="") as f:
                csv.writer(f).writerow(
                    [reading.last_updated, reading.composite, reading.regime, reading.btc_price]
                )
            print(f"[{reading.last_updated}] composite={reading.composite} regime={reading.regime}")
            last_seen = reading.last_updated
    except ASTROError as e:
        print(f"error: {e}")

    time.sleep(60)
