# ASTRO MCP 0.7.0 — public intelligence

No signup, API key, payment, trial, or OS credential store is required. The four tools run over local stdio; the intelligence backend runs on ASTRO's VPS. This also supports headless MCP containers.

## Install

Python 3.10+ required. Clone this repository or extract the 0.7.0 ZIP. Create a virtual environment and install `.[mcp]`:

```sh
python -m venv .venv
# Windows: .venv/Scripts/python.exe; Linux/macOS: .venv/bin/python
.venv/bin/python -m pip install '.[mcp]'
.venv/bin/python scripts/check_mcp_stdio.py
.venv/bin/python scripts/check_mcp_live.py
```

Set your MCP client's command to the absolute installed `astro-mcp` executable and arguments to `["serve"]`. Call `astro_signal`, `astro_context`, or `astro_basket` directly. `astro_get_started` explains access. The live check initializes the real MCP protocol and verifies all three live tools including ten assets, without credentials.

The complete signal, context and basket intelligence is returned, including prediction-market inputs where available, component scores, rankings, strategy assessments and explanations. No trades, private positions, customer records or account balances are exposed. Source timestamps, missing inputs and stale flags remain visible.

## Access and caching

Public routes are `https://64.227.50.56/api/public/signal`, `/api/public/context`, and `/api/public/basket`. No shared API key is embedded or issued. Public intelligence comes from the same response builders as the authenticated API; only tier/plan labels differ. Server calculations may be reused for 30 seconds, and the connector caches each resource for 900 seconds. Caching never changes source observation timestamps. Service capacity and availability limits apply.

## Upgrade

0.6.0 and earlier required trial credentials; 0.7.0 does not. Install in a new folder/environment and update your client command. No need to delete saved credentials. Existing paid API keys and account entitlements remain untouched. `astro-mcp configure` now explains that no key is required. Legacy trial/account functionality is not invoked by this connector.

The setup website is not a remote MCP protocol endpoint. Glama builds this stdio server in its own container. Passing startup alone is insufficient: run the live MCP check there before release.
