# ASTRO MCP Server and Crypto Intelligence API

**This repository contains the runnable Python/stdio MCP server implementation**, not just an API specification or client example. The server runs locally in an MCP-compatible client and retrieves intelligence from ASTRO's hosted HTTPS API.

## MCP server 0.7.1: source and tools

- [Server implementation and all four tool definitions](astro_intelligence/mcp_server.py)
- [HTTP transport, response handling, and polling cache](astro_intelligence/client.py)
- [Legacy trial compatibility (not used by current MCP)](astro_intelligence/anonymous.py)
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

MCP 0.7.1 provides the complete public intelligence responses without signup, API keys, trial activation, payment details, or a credential store. It works in headless containers as well as desktop clients. Call any intelligence tool immediately after connecting. Existing saved credentials and account records are untouched.

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
Its API exposes the components behind those assessmentsâ€”not just a final number.

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
  and veto reasonsâ€”not executed customer orders.

**Supported assets:** BTC Â· ETH Â· SOL Â· ADA Â· DOGE Â· ARB Â· OP Â· LINK Â· POL Â· DOT

## Hosted API: start without credentials

Public intelligence is free to access right now, without signup or an ASTRO API
key. Use **`https://64.227.50.56`**, the primary HTTPS address.

| Route | Response |
|---|---|
| `GET /api/public/signal` | Composite, regime, component summary and observation metadata |
| `GET /api/public/context` | Explanations, prediction-market context and supporting intelligence |
| `GET /api/public/basket` | Ten-asset scores, funding, volatility, strategy assessments and freshness |

```sh
python examples/public_snapshot.py
```

This dependency-free example reads each resource once, needs no credentials,
and places no trades. Cache responses between collection cycles (about fifteen
minutes); do not treat cached responses as newly observed data. Check missingness,
stale flags and source timestamps before use. Capacity limits still apply.

Existing authenticated `/api/signal`, `/api/context`, and `/api/basket` routes
remain separate compatibility paths. Their keys and account entitlements are not
needed for public access. See the [API guide](docs/API.md).

## Try it in your workflow

- [Live Signal Explorer](https://64.227.50.56/explore/)
- [Connect your own rig](https://64.227.50.56/explore/#your-rig)
- [Download the n8n starter](https://64.227.50.56/explore/astro-n8n-market-brief.json)
- [n8n setup instructions](https://64.227.50.56/explore/astro-n8n-setup.txt)
- [MCP setup](https://64.227.50.56/mcp) (webpage, not a remote MCP endpoint)

The n8n starter fetches data, validates observation freshness, and produces a
market brief and structured rows. It was verified in n8n 2.43.7, including
stale-data rejection. It is manual and read-only: attach your own destination or
schedule. It does not send notifications or execute trades by itself.

## Hosted runtime checkpoint — October 25, 2026

The private hosted engine now uses versioned, committed signal cycles. The
integrity rollout corrected contract interpretation, source-unit handling, and
missing/stale-data paths while preserving the original signal architecture.
Prediction-market translation and congressional activity remain part of ASTRO.

Module 8 records forward shadow comparisons; active weights remain the defaults.
Shadow outcomes are research evidence, not demonstrated trading profit or an
automatic promotion mechanism. These backend changes do not imply a new MCP
package version: the connector remains 0.7.1.

This is a dated implementation checkpoint, not an uptime or performance guarantee.

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

## Source SDK 0.7.1

The client in this repository now uses the three hosted routes. Install from a
local checkout with `python -m pip install .`, then use `ASTRO(public_access=True)`
for credential-free intelligence. Keyed mode remains available for compatibility. This update has **not** been published to PyPI.

`ASTRO.snapshot()` returns raw signal/context/basket responses. Typed helpers
reuse a 900-second per-resource cache; they preserve missing scores as null.
See [SDK behavior and migration](docs/SDK.md).

## About this repository

This repository contains ASTRO's **MCP server implementation**, Python SDK, integration documentation, and OpenAPI specification. The full repository also contains website source; this connector archive does not include the website. The separate `astro-oracle` repository is a project archive. The private hosted collector and paper-execution runtime are separate from the MCP server source linked above.

For new integrations, use [the API guide](docs/API.md), the
[dependency-free snapshot example](https://github.com/jarvisways-cyber/astro-starbase-crypto-api/blob/main/examples/api_snapshot.py), or the updated
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


### Public MCP access (0.7.1)
The current connector uses public intelligence routes, with no signup or trial. Versions 0.6.0 and earlier used anonymous trial activation; upgrade to 0.7.1 for credential-free access. The server may reuse calculations for up to 30 seconds; the connector caches each resource for up to 15 minutes. Source timestamps and stale/missing flags remain unchanged. Availability and service capacity limits apply; no unlimited-uptime promise is made.
