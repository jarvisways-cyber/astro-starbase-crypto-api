# A.S.T.R.O. Starbase ? Crypto Intelligence API

**Asset Sentiment Trend Risk Oracle**

Explainable crypto market intelligence for dashboards, screeners, research,
alerts, and trading systems. Use ASTRO's analysis without running its bot.

**[Get API access — $9/month](https://astro-event-horizon.vercel.app/)** ·
**[API guide](docs/API.md)** · **[Python example](examples/api_snapshot.py)**

## MCP and free one-month trials

Use the free [MCP connector](docs/MCP.md) to read all three public intelligence
resources in a compatible AI client. Decision-support assessments are retained;
private paper execution and account state are not exposed.

[Activate a 30-day trial](https://astro-event-horizon.vercel.app/trial) through
email verification. No card, automatic billing, or social engagement required.
One trial per normalized email, including prior invited trials. Existing paid
and Founding Supporter keys continue to work. Keep credentials out of AI chats.

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

## Optional one-time consumer bot purchase

Want a local ASTRO paper-trading client and another way to support the project?
See the [Trade Bot page](https://astro-event-horizon.vercel.app/bot).
Qualifying founding-year purchases include API access without another subscription
charge while ASTRO operates the service, subject to published limits, plus lifetime
consumer-software updates. See [cohort dates and terms](docs/FOUNDING_SUPPORTERS.md).

The current v3.2 package is paper-only and includes the reliability improvements.
Read the [release limitations and purchase distinction](docs/CONSUMER_BOT.md)
before treating it as a validated trading product. The API does not require it.

## Source SDK 0.2.0

The client in this repository now uses the three hosted routes. Install from a
local checkout with `python -m pip install .`, then run an example that asks for
your key in a masked prompt. This update has **not** been published to PyPI.

`ASTRO.snapshot()` returns raw signal/context/basket responses. Typed helpers
reuse a 900-second per-resource cache; they preserve missing scores as null.
See [SDK behavior and migration](docs/SDK.md).

## About this repository

This is ASTRO's **public crypto API hub**: current integration documentation,
a runnable HTTP example, and the source Python client and core OpenAPI
specification. The separate `astro-oracle` repository is the project archive,
not the customer API hub. Mother production code and runtime state are not part
of this documentation update.

For new integrations, use [the API guide](docs/API.md), the
[dependency-free snapshot example](examples/api_snapshot.py), or the updated
[source SDK](docs/SDK.md). The [OpenAPI specification](openapi.yaml) documents
the three hosted resources and permits additive intelligence fields.

[Architecture and research lineage](docs/ARCHITECTURE.md) explains the wider
project. The [previous Starbase overview](docs/HISTORICAL_OVERVIEW.md) preserves
its original design discussion and historical research claims without presenting
them as current performance evidence or deployment instructions.

The existing [MIT license](LICENSE) is retained for this API repository. The SDK
has not been published to PyPI. The separate paid consumer release is described
in [consumer release notes](docs/CONSUMER_BOT.md).

**[Explore ASTRO and get access](https://astro-event-horizon.vercel.app/)**


### Anonymous MCP pilot (0.4.0)
Install from [ASTRO MCP](https://astro-event-horizon.vercel.app/mcp). First intelligence use activates 30 consecutive days without email/card, subject to network and pilot caps. A native OS credential store is required. At expiry, signup is prompted; no automatic billing. Existing keys take precedence when configured. See [MCP details](docs/MCP.md).
