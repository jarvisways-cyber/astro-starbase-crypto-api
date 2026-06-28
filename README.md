# A.S.T.R.O. Starbase — Crypto Intelligence API

**Asset · Sentiment · Trend · Risk · Oracle**

> **Not a signal. A translation of the market itself.**

A.S.T.R.O. is a financial cognition engine that continuously ingests live global market intelligence across nine independent signal domains and synthesizes it into a single, machine-readable probability framework for digital assets.

Rather than measuring what the market is doing — it models what the market is **likely to do next**.

**One API call every fifteen minutes. Complete strategic assessment. No charts. No config. No noise.**

---

## Install

```bash
pip install astro-intelligence
```

## Quick Start

```python
from astro_intelligence import ASTRO

client = ASTRO(api_key="your-key")

reading = client.composite()

print(reading.regime)        # "BEAR_ACCUMULATION"
print(reading.composite)     # 53.18
print(reading.fear_greed)    # 34.0

gate = client.gate("BTC")
print(gate)                  # "OPEN" or "BLOCKED"
```

```python
# Per-asset intelligence
assets = client.assets()
for symbol, data in assets.items():
    print(f"{symbol}: asc={data['ascendancy']} vel={data['velocity']} gate={data['gate']}")
```

**[Get API Access → astro-event-horizon.vercel.app](https://astro-event-horizon.vercel.app)**

---

## The Nine Signal Domains

| Domain | Source | What It Measures |
|--------|--------|-----------------|
| Fear & Greed | Alternative.me | Market sentiment index |
| Market Structure | Binance | BTC SMA200 regime classification |
| Funding Rates | Bybit / Kraken | Leverage sentiment — longs vs shorts |
| Liquidity Pressure | Kraken order books | Live bid/ask depth across 7 pairs |
| Macro Correlation | FRED — DXY, VIX, QQQ, GLD | Dollar strength, yield curve, volatility |
| On-Chain Flows | Blockchain.info | Mempool, volume, transactions per second |
| Options Flow | Deribit | Put/call ratio, IV skew, max pain — BTC + ETH |
| Narrative Sentiment | CoinGecko + Polymarket + Kalshi | Trending velocity + prediction market positioning |
| Congress / Smart Money | Kalshi | Congressional trading signal — 30-day composite |

Every domain feeds a composite score (0–100) and a regime classification updated continuously every ~15 minutes.

---

## Ascendancy & Velocity

The most differentiated layer in ASTRO's intelligence stack.

Every cycle, the engine scans active prediction markets on **Polymarket and Kalshi** — platforms where real capital is staked on future outcomes. Each market question is classified against 15+ event categories and mapped to per-asset relevance weights.

An ETF approval signal scores BTC at maximum relevance and DOGE at minimal. An SEC enforcement action scores ETH and SOL at high sensitivity. Every asset responds to every event type according to its own calibrated sensitivity profile. Markets are volume-weighted using log10 normalization — no single market can dominate the output.

**Ascendancy** — a 0–100 probability-weighted measure of how favorably the prediction market intelligence landscape is positioned for each asset right now.

**Velocity** — the rate of change in Ascendancy between cycles, revealing whether conditions are accelerating toward an asset or retreating from it.

These two scores feed directly into the Asset Gate, the Shield dynamic calibration, and per-asset position sizing inside the engine.

---

## Asset Gate Status

The engine synthesizes all nine domains into a continuous gate decision for each supported asset:

- **OPEN** — capital conditions favor entry consideration across multiple independent domains simultaneously
- **BLOCKED** — structural, macro, or signal conditions do not support entry — engine is protecting capital

Gate incorporates: SMA200 position · composite score · ascendancy · velocity · regime classification.

**Supported assets:** BTC · ETH · SOL · ADA · DOGE · LINK · DOT · POL · ARB · OP

---

## API Endpoints

**Base URL:** `https://astro-event-horizon.vercel.app/api/signal`

| Endpoint | Description |
|----------|-------------|
| `/oracle/composite` | Full composite score + all 9 signals + regime + top movers |
| `/oracle/signals` | Individual signal domain breakdown |
| `/oracle/assets` | Per-asset ascendancy, velocity, SMA200, gate status |
| `/oracle/congress` | Congressional smart money signal detail |
| `/oracle/history` | Historical oracle cycles with 1h + 4h outcome tracking |

**Authentication:** `?api_key=your-key` or `X-API-Key` header

**Rate limit:** 1 request per 15 minutes — synchronized with oracle cycle time

---

## Sample Response — `/oracle/composite`

```json
{
  "composite": 53.18,
  "regime": "BEAR_ACCUMULATION",
  "btc_price": 59441.40,
  "signals": {
    "fear_greed": 34.0,
    "market_structure": 51.2,
    "funding_rates": 49.8,
    "liquidity_pressure": 52.1,
    "macro_correlation": 55.0,
    "onchain_flows": 44.3,
    "options_flow": 48.9,
    "narrative_sentiment": 61.4,
    "congress_smart_money": 58.2
  },
  "watching": [
    { "symbol": "SOL", "change_24h": 1.87 },
    { "symbol": "BTC", "change_24h": 0.91 }
  ],
  "last_updated": "2026-06-28T20:06:47Z"
}
```

---

## Backtest Validation

Same historical dataset (June 2024 – June 2026, 721 days). Validated across sensitivity tests, walk-forward analysis, Monte Carlo simulation, grid search, and regime stress tests.

| Metric | Baseline | ASTRO | Delta |
|--------|----------|-------|-------|
| Total Return | +0.4% | +29.6% | +29.2pp |
| Max Drawdown | -17.0% | -15.8% | +1.2pp |
| Avg Win % | 15.8% | 19.0% | +3.2pp |
| Avg Loss % | -17.8% | -14.0% | +3.8pp |
| Trades | 102 | 71 | -31 (higher quality) |

---

## System Status

| Component | Status |
|-----------|--------|
| 9-signal oracle architecture | Live |
| Prediction market layer (Polymarket + Kalshi) | Active |
| Per-asset ascendancy + velocity scoring | Live |
| Continuous ~15-minute oracle cycles | Running |
| REST API — 5 endpoints | Live |
| Outcome tracking (1h + 4h) | Logging every cycle |
| Stripe payment + instant key delivery | Live |
| Self-optimizing weight layer (Module 8) | Building — target: 2,000 cycles |

---

## Access

**$9/month — Full access. All endpoints. All nine signals. All ten assets.**

API key delivered instantly to your email upon payment.

**[astro-event-horizon.vercel.app](https://astro-event-horizon.vercel.app)**

---

## About ASTRO Starbase

ASTRO Starbase is the intelligence distribution layer of the A.S.T.R.O. architecture. Each Starbase repository houses a domain-specific API client powered by the same underlying cognition engine. This repo: crypto market intelligence. The architecture is designed to extend — equities, macro, derivatives, and beyond.

---

Built by **JARVIS** — solo developer, Anchorage AK · [jarvisways-cyber](https://github.com/jarvisways-cyber)

*Not financial advice. Past backtest performance does not guarantee future results. ASTRO is currently in paper trading — accumulating live auditable history toward full autonomous deployment.*
