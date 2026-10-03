# ASTRO MCP 0.6.0 — try first, register later

## Review and run the implementation

The MCP server is implemented in [`astro_intelligence/mcp_server.py`](../astro_intelligence/mcp_server.py), including the `FastMCP` instance, four tool definitions, and stdio startup. [`anonymous.py`](../astro_intelligence/anonymous.py) implements first-use activation; [`client.py`](../astro_intelligence/client.py) implements HTTPS requests and caching. These files are in this repository, not an external private runtime.

To install from GitHub, clone this repository and follow the [root README's source installation steps](../README.md#install-the-mcp-server-from-this-repository). After installing `.[mcp]`, run `python scripts/check_mcp_stdio.py` using that environment's Python. This checks real MCP initialization, tool discovery, and setup guidance without using the hosted API or starting a trial.

The hosted market-data collector is a separate service. A headless environment without native credential storage can inspect and initialize this MCP server, but cannot perform anonymous activation. This is not a hosted HTTP MCP endpoint or a standalone offline market-data engine.

ASTRO is a local stdio connector, not a hosted HTTP MCP endpoint. It exposes the complete public signal, context and basket responses, including decision-support gates and explanations. No trading execution, private positions, balances or orders are exposed.

## Direct data migration

Version 0.6.0 fetches signal, context and basket from https://64.227.50.56 using normal HTTPS certificate validation. Signup, trial activation, and terms now use the same direct VPS origin. Checkout remains on Stripe. Existing native credential-store entries and trial deadlines are reused; reinstalling is not a new trial. There is no automatic fallback to the old tunnel. The Python SDK still permits an explicit HTTPS base_url override. This remains a local stdio MCP connector, not a remote HTTP MCP server.

## Install and connect

Download https://64.227.50.56/downloads/astro-intelligence-mcp-0.6.0.zip and extract. Version 0.5.0 remains available at https://64.227.50.56/downloads/astro-intelligence-mcp-0.5.0.zip for rollback. Python 3.10+ required. In the extracted directory:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install ".[mcp]"
```

On macOS/Linux use `python3 -m venv .venv` then `.venv/bin/python -m pip install '.[mcp]'`.

In your MCP client, set command to the absolute installed `astro-mcp` executable and args to `["serve"]`. Do not put a key in the client configuration. Windows Credential Manager, macOS Keychain or Linux Secret Service is required; plaintext fallback is deliberately unavailable.

First use of astro_signal, astro_context or astro_basket automatically activates a 30-day anonymous trial. A random installation recovery credential and API key are stored in the native credential store. No email/card/engagement is required. Use initiates the trial under https://64.227.50.56/terms and /privacy. Initialization, tool listing and astro_get_started do not activate it. Intelligence tools are marked nondestructive but not readOnlyHint because first use provisions a credential.

The deadline is fixed at activation, not 30 active days. Reconnection reuses it. Responses include the expiry date and days remaining, never the key. At expiry the connector returns a signup URL, not cached intelligence. It makes no payment. Follow https://64.227.50.56/trial and then run `astro-mcp configure` in a local interactive terminal with the issued key; restart the connector. Tool names/integration stay unchanged, but the key changes. Never share keys/codes with the AI.

Existing customers should run `astro-mcp configure` before their first request. A configured key takes precedence over anonymous access. Anonymous recovery cannot revive a revoked/deleted key. Verified-email trials retain their separate eligibility policy, so an anonymous user may also qualify for that trial after verification.

Pilot controls: 3 fresh grants per network over 30 days, 25/day globally, 250 total; 60 activation requests/network/hour. These are installation/network limits, not verified people. Shared networks can hit limits. Deleting credentials, different networks, or multiple mailboxes can circumvent some controls. No hardware fingerprinting. Signup remains an alternative at capacity. Capacity denial does not disable already-issued keys.

New access usually takes about a minute to synchronize and can take five; an activating result requests a retry. Standard polling is one request/resource/key/900 seconds. The connector reuses responses within that interval; inspect source timestamps, nulls, stale flags and source limitations. Scores are not calibrated winning probabilities.

Tools: astro_get_started (public instructions), astro_signal, astro_context, astro_basket. Installing does not automatically list ASTRO in directories or install it in other AI clients. This source package is not a PyPI publication.
