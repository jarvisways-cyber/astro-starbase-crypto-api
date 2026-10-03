# ASTRO MCP Server and Crypto Intelligence API

**This repository contains the runnable Python/stdio MCP server implementation**, not just an API specification or client example. The server runs locally in an MCP-compatible client and retrieves intelligence from ASTRO's hosted HTTPS API.

## MCP server 0.7.0: source and tools

- [Server implementation and all four tool definitions](astro_intelligence/mcp_server.py)
- [HTTP transport, response handling, and polling cache](astro_intelligence/client.py)
- [First-use trial activation and recovery](astro_intelligence/anonymous.py)
- [Dependencies and `astro-mcp` executable entry point](pyproject.toml)
- [MCP protocol and behavior tests](tests/test_mcp.py)

| MCP tool | Function |
|---|---|
| `astro_get_started` | Setup instructions; no account creation or external request |
| `astro_signal` | Composite, market regime, component summary, and source metadata |
| `astro_context` | Component explanations and available prediction-market, macro, sentiment, and liquidity context |
| `astro_basket` | Ten-asset analysis including funding, volatility, rankings, strategy assessments, and freshness indicators |

The tools expose intelligence and decision support, **not trade execution, private positions, or account balances**. Missing or stale inputs remain visible; scores are not calibrated winning probabilities.

## Install the MCP server from this repository

Python 3.10+ is required. No PyPI publication is implied by these commands.

```sh
git clone https://github.com/jarvisways-cyber/astro-starbase-crypto-api.git
cd astro-starbase-crypto-api
python -m venv .venv
```

Windows:

```powershell
.\.venv\Scripts\python.exe -m pip install ".[mcp]"
.\.venv\Scripts\python.exe scripts/check_mcp_stdio.py
```

macOS/Linux (use `python3` above if needed):

```sh
.venv/bin/python -m pip install '.[mcp]'
.venv/bin/python scripts/check_mcp_stdio.py
```

The check starts a real stdio subprocess, initializes MCP, lists all four tools, and calls setup guidance. **It does not activate a trial or require a key.**

Configure your AI client's MCP server with the absolute path to `.venv/Scripts/astro-mcp.exe` on Windows or `.venv/bin/astro-mcp` on macOS/Linux, and arguments `["serve"]`. The transport is **stdio**, not HTTP. [Full client setup and access behavior](docs/MCP.md).

MCP 0.7.0 provides the complete public intelligence responses without signup, API keys, trial activation, payment details, or a credential store. It works in headless containers as well as desktop clients. Call any intelligence tool immediately after connecting. Existing saved credentials and account records are untouched.

Run `python scripts/check_mcp_live.py` in the installed environment to test all three tools against the live public service. This test supplies no credentials and requires all ten assets in the basket. It creates no account and sends no email.

## Local MCP server versus hosted backend

```text
AI client <--- MCP stdio ---> this repository's Python server
                                      |
                                      +--- HTTPS ---> ASTRO intelligence/account API
```

All MCP protocol handling, tool definitions, local caching, trial recovery, and credential-store integration are present in this repository. The market collector and private paper-execution engine run separately on the VPS and are not required to install or inspect this MCP server. This connector requires the hosted service for live intelligence; it does not collect market data independently.

**https://64.227.50.56/mcp is a setup webpage, not a remote MCP protocol endpoint.** The same repository also includes the website, API integration documentation, and Python SDK described below.

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

Use **`https://64.227.50.56`**, ASTRO's primary HTTPS address.

MCP 0.7.0 uses this VPS for credential-free intelligence. The previous
Vercel address remains available temporarily for compatibility and rollback;
new integrations should use the primary address. This is the same ASTRO service,
not a separate plan. Existing keys and trial deadlines remain unchanged.

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
See the [Trade Bot page](https://64.227.50.56/bot).
Qualifying founding-year purchases include API access without another subscription
charge while ASTRO operates the service, subject to published limits, plus lifetime
consumer-software updates. See [cohort dates and terms](docs/FOUNDING_SUPPORTERS.md).

The current v3.2 package is paper-only and includes the reliability improvements.
Read the [release limitations and purchase distinction](docs/CONSUMER_BOT.md)
before treating it as a validated trading product. The API does not require it.

## Source SDK 0.7.0

The client in this repository now uses the three hosted routes. Install from a
local checkout with `python -m pip install .`, then run an example that asks for
your key in a masked prompt. This update has **not** been published to PyPI.

`ASTRO.snapshot()` returns raw signal/context/basket responses. Typed helpers
reuse a 900-second per-resource cache; they preserve missing scores as null.
See [SDK behavior and migration](docs/SDK.md).

## About this repository

This repository contains ASTRO's **MCP server implementation**, Python SDK, website, integration documentation, and OpenAPI specification. The separate `astro-oracle` repository is a project archive. The private hosted collector and paper-execution runtime are separate from the MCP server source linked above.

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

**[Explore ASTRO and get access](https://64.227.50.56/)**


### Public MCP access (0.7.0)
The current connector uses public intelligence routes, with no signup or trial. Versions 0.6.0 and earlier used anonymous trial activation; upgrade to 0.7.0 for credential-free access. The server may reuse calculations for up to 30 seconds; the connector caches each resource for up to 15 minutes. Source timestamps and stale/missing flags remain unchanged. Availability and service capacity limits apply; no unlimited-uptime promise is made.
