# A.S.T.R.O. Starbase — Crypto Intelligence API

**Asset · Sentiment · Trend · Risk · Oracle**

[![PyPI](https://img.shields.io/badge/pip-astro--intelligence-blue)](https://pypi.org/project/astro-intelligence/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange)](#system-status)

> **Not a signal. A translation of the market itself.**

A.S.T.R.O. is a financial cognition engine that continuously ingests live global market intelligence across nine independent signal domains and synthesizes it into a single, machine-readable probability framework for digital assets.

Rather than measuring what the market is doing — it models what the market is **likely to do next**.

**One API call every fifteen minutes. Complete strategic assessment. No charts. No config. No noise.**

This repository contains the **public API client and specification** for the crypto intelligence layer. The autonomous trading engine built on top of this oracle (Vanguard/Director/Arbiter) is a separate, private product currently accumulating live paper-trading history — see [System Status](#system-status) below for what's live today.

---

## Install

```bash
pip install astro-intelligence
```

Or clone this repo and install locally:

```bash
git clone https://github.com/jarvisways-cyber/astro-starbase-crypto-api
cd astro-starbase-crypto-api
pip install -e .
```

## Quick Start

```python
from astro_intelligence import ASTRO

client = ASTRO(api_key="your-key")  # or set ASTRO_API_KEY env var

reading = client.composite()
print(reading.regime)        # "BEAR_ACCUMULATION"
print(reading.composite)     # 53.18
print(reading.fear_greed)    # 34.0

gate = client.gate("BTC")
print(gate.gate)              # "OPEN" or "BLOCKED"
print(gate.strategy)          # "CANDLE_REVERSAL"
print(gate.confidence)        # 0.847
```

```python
# Per-asset intelligence across the whole basket
assets = client.assets()
for symbol, data in assets.items():
    print(f"{symbol}: asc={data.ascendancy} vel={data.velocity} gate={data.gate}")
```

More runnable examples in [`examples/`](examples/).

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

> **Note:** the public-facing signal page also references candle-pattern recognition and prediction-market intelligence as additional layers (11 total signals in some docs). This README uses the canonical 9-domain composite; see [`openapi.yaml`](openapi.yaml) for the full, versioned field list as it's finalized.

---

## Ascendancy & Velocity

The most differentiated layer in ASTRO's intelligence stack.

Every cycle, the engine scans active prediction markets on **Polymarket and Kalshi** — platforms where real capital is staked on future outcomes. Each market question is classified against 15+ event categories and mapped to per-asset relevance weights.

An ETF approval signal scores BTC at maximum relevance and DOGE at minimal. An SEC enforcement action scores ETH and SOL at high sensitivity. Markets are volume-weighted using log10 normalization — no single market can dominate the output.

**Ascendancy** — a 0–100 probability-weighted measure of how favorably the prediction market intelligence landscape is positioned for each asset right now.

**Velocity** — the rate of change in Ascendancy between cycles, revealing whether conditions are accelerating toward an asset or retreating from it.

---

## Asset Gate Status

- **OPEN** — capital conditions favor entry consideration across multiple independent domains simultaneously
- **BLOCKED** — structural, macro, or signal conditions do not support entry — engine is protecting capital

**Supported assets:** BTC · ETH · SOL · ADA · DOGE · LINK · DOT · POL · ARB · OP

---

## API Reference

**Base URL:** `https://astro-event-horizon.vercel.app/api/signal`

Full machine-readable spec: [`openapi.yaml`](openapi.yaml) — import into Postman, Swagger UI, or any OpenAPI client generator.

| Endpoint | Description |
|----------|-------------|
| `/oracle/composite` | Full composite score + signals + regime + top movers |
| `/oracle/signals` | Individual signal domain breakdown |
| `/oracle/assets` | Per-asset ascendancy, velocity, SMA200, gate status |
| `/oracle/regime` | Regime context, confluence, 4h trend, shift |
| `/oracle/risk` | Risk mode, kelly multiplier, max positions |
| `/oracle/prices` | Live prices, all 10 assets |
| `/oracle/congress` | Congressional smart-money signal detail |
| `/oracle/history` | Historical oracle cycles with 1h + 4h outcome tracking |
| `/oracle/gate/:asset` | Complete single-asset decision package |
| `/oracle/basket` | Full 10-asset scan in one call |

**Authentication:** `?api_key=your-key` or `X-API-Key` header

**Rate limit:** 1 request per 15 minutes — synchronized with oracle cycle time. Requests during an active cycle return the prior cycle's reading; see [`openapi.yaml`](openapi.yaml) `429`/`CycleNotReady` responses for exact behavior.

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

Historical dataset (June 2024 – June 2026, 721 days). Validated across sensitivity tests, walk-forward analysis, Monte Carlo simulation, grid search, and regime stress tests.

| Metric | Baseline | ASTRO | Delta |
|--------|----------|-------|-------|
| Total Return | +0.4% | +29.6% | +29.2pp |
| Max Drawdown | -17.0% | -15.8% | +1.2pp |
| Avg Win % | 15.8% | 19.0% | +3.2pp |
| Avg Loss % | -17.8% | -14.0% | +3.8pp |
| Trades | 102 | 71 | −31 (higher quality) |

**Scope note:** this backtest validates the *signal composite and strategy logic* offline. It does **not** reflect the current live paper-trading account performance, which is tracked separately and not yet published here. Backtests use 5 of 9 real signals — remaining signals pinned neutral due to historical data limitations.

---

## System Status

| Component | Status |
|-----------|--------|
| 9-signal oracle architecture | ✅ Live |
| Prediction market layer (Polymarket + Kalshi) | ✅ Active |
| Per-asset ascendancy + velocity scoring | ✅ Live |
| Continuous ~15-minute oracle cycles | ✅ Running |
| REST API | ✅ Live |
| Outcome tracking (1h + 4h) | ✅ Logging every cycle |
| Stripe payment + instant key delivery | ✅ Live |
| Python client (`astro_intelligence`) | 🔄 Alpha — see [CHANGELOG](CHANGELOG.md) |
| OpenAPI spec | 🔄 Draft — field shapes being finalized against live responses |
| Self-optimizing weight layer | 🔄 Building |
| Autonomous trading engine (separate product) | 🔒 Private — accumulating auditable paper history |

---

## Access

**$9/month — Full access. All endpoints. All nine signals. All ten assets.**

API key delivered instantly to your email upon payment.

**[→ astro-event-horizon.vercel.app](https://astro-event-horizon.vercel.app)**

---

## Contributing

Issues and PRs welcome — this is an early-stage public API surface and feedback on the client/spec is genuinely useful. See [CHANGELOG.md](CHANGELOG.md) for what's changed recently.

---

## Philosophy

ASTRO was built on a simple frustration: every trading tool treats signals as isolated facts. But markets are systems — fear, liquidity, macro pressure, on-chain behavior, and institutional positioning all interact simultaneously. ASTRO's oracle exists to model that interaction.

*What is the market doing right now — and is this a good time to be in it?*

---

Built by **JARVIS** — solo developer, Anchorage AK · [jarvisways-cyber](https://github.com/jarvisways-cyber)

*Not financial advice. Past backtest performance does not guarantee future results.*
