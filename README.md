# A.S.T.R.O. — Crypto Intelligence API

**Asset Sentiment Trend Risk Oracle**

Explainable crypto market intelligence for dashboards, screeners, research,
alerts, and trading systems. Use ASTRO's analysis without running its bot.

**[Get API access — $9/month](https://astro-event-horizon.vercel.app/)** ·
**[API guide](docs/API.md)** · **[Python example](examples/api_snapshot.py)**

## See the inputs behind the assessment

ASTRO combines market inputs into regime assessments and asset-level scores.
Its API exposes the components behind those assessments—not just a final number.

- **Nine weighted composite components:** fear/greed, market structure, funding,
  liquidity, macro, on-chain, options, narrative, and congressional-activity scores.
- **Calculation explanations:** active weights, bear-regime inversions, component
  contributions, and subsequent adjustments.
- **Cross-asset context:** 24-hour changes, volume, rankings, and BTC-relative
  breadth, with coverage and freshness information.
- **Supporting intelligence:** momentum/sentiment axes, per-asset funding, open
  interest, stablecoin supply, macro prediction-market context, SMA, ATR, and
  candle-pattern details where available.
- **Decision context:** per-asset scores, strategy assessments, dimension checks,
  and veto reasons—not executed customer orders.

**Supported assets:** BTC · ETH · SOL · ADA · DOGE · ARB · OP · LINK · POL · DOT

## Hosted API

Use **`https://astro-event-horizon.vercel.app`**, not an old tunnel address.

| Route | Response |
|---|---|
| `GET /api/signal` | Published composite, regime, component summary, BTC quote and observation metadata |
| `GET /api/context` | Weighted explanations, adjustment trace, rankings/breadth and supporting intelligence |
| `GET /api/basket` | Ten-asset scan: prices, score velocity, SMA, funding, ATR, strategy assessments and explanations |

Authenticate with the **`X-API-Key` header**. Keep your key server-side, out of
URLs, public frontends, repositories and screenshots.

**Polling: one request per resource per key every 15 minutes.** Fetch signal,
context and basket once each in the same cycle, then cache them. This is an
intelligence service, not a tick-by-tick streaming product.

### Try a complete data cycle

Python 3.10+; no third-party packages needed:

```sh
python examples/api_snapshot.py
```

The example asks for your key in a **local masked prompt**, fetches all three
routes and prints a market summary. It never places trades or saves your key.
See the [API guide](docs/API.md) for fields, status handling and interpretation.

## VPS deployment milestone — September 30, 2026

The backend now runs on a VPS rather than a laptop connection. Collection, API
delivery, customer-key synchronization and internal paper execution are separate
supervised services.

Verified at deployment:

- One customer key fetched all three public routes successfully.
- Missing/invalid keys were rejected; all ten assets had quote data.
- Component contributions reconciled to the base score.
- Collection continued after the paper worker stopped.
- API restart preserved history; release and state rollback checkpoints were saved.

This dated verification is **not an uptime SLA or profitability claim**.

## Interpret the intelligence correctly

- Composite and ascendancy are **scores**, not calibrated probabilities of profit.
- Velocity measures changes in the asset's intelligence score, not price returns.
- Collection time does not establish freshness of every upstream source. Fallbacks
  may be present; check quality, missingness and stale fields.
- Strategy confidence is a heuristic, not a winning-probability estimate.
- An `OPEN` analytical gate is not an order or a promise of execution.

## API first; trading research separately

Customers can integrate ASTRO into their own software. These endpoints do not
require an ASTRO bot installation and do not execute customer trades.

The internal bot remains **paper-only**. Module 8 evaluates candidate signal
weights separately; it does **not automatically replace published weights**.
Hive and broader autonomous strategy improvement remain development work.

## About this repository

This is ASTRO's **public crypto API hub**: current integration documentation,
a runnable HTTP example, and the preserved alpha Python client and draft OpenAPI
specification. The separate `astro-oracle` repository is the project archive,
not the customer API hub. Mother production code and runtime state are not part
of this documentation update.

For new integrations, use [the API guide](docs/API.md) and
[the snapshot example](examples/api_snapshot.py). The existing `astro_intelligence`
alpha client and `openapi.yaml` predate the VPS contract and are **not yet reconciled
with these hosted routes**. Their presence is not a claim of current compatibility.

[Architecture and research lineage](docs/ARCHITECTURE.md) explains the wider
project. The [previous Starbase overview](docs/HISTORICAL_OVERVIEW.md) preserves
its original design discussion and historical research claims without presenting
them as current performance evidence or deployment instructions.

The existing [MIT license](LICENSE) is retained. No SDK package release is implied
by this documentation update.

**[Explore ASTRO and get access](https://astro-event-horizon.vercel.app/)**
