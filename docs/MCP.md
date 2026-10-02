# ASTRO MCP connector

Free, read-only connector; live data requires an ASTRO key. The connector does
not place orders, enroll users in billing, send email, or accept keys in tools.
All fields from the three public API resources are retained, including strategy
assessments, gates, confidence, vetoes and explanations. These are analytical
outputs, not trade execution. No private account, order or position endpoint is exposed.

## Private setup

1. Existing customers use their existing key. New users visit
   https://astro-event-horizon.vercel.app/trial in a browser, enter an email and
   use case, and verify the email there. Never give the AI the verification code.
2. Install this repository's Python package with the `mcp` extra in an isolated
   environment (`python -m pip install '.[mcp]'` from this checkout).
   This release is not yet published to PyPI.
3. Run `astro-mcp configure` in your own terminal. It prompts with masked input
   and saves the key in Windows Credential Manager, macOS Keychain, or Linux
   Secret Service. Plaintext fallback stores are rejected. Never put a key in
   a command argument, MCP JSON, or chat.
4. Configure your MCP-capable client to launch the installed `astro-mcp`
   executable with argument `serve`, using stdio. Use its absolute executable
   path if the client cannot find your isolated environment. No secret env
   values are needed. Restart the client after changing the saved key.

Example client configuration (replace only the executable path):

```json
{"mcpServers":{"astro":{"command":"/absolute/path/to/astro-mcp","args":["serve"]}}}
```

Tools: `astro_get_started`, `astro_signal`, `astro_context`, `astro_basket`.
All tools have no arguments. Setup returns only a public signup URL and
instructions; it does not collect credentials in the assistant conversation.

## Trial and data limits

30 days from verified activation, not first API call. One trial per normalized
email, including previously invited trials. No automatic renewal or billing.
Founders keep their qualifying entitlement. Expiry/revocation propagation can
take up to five minutes. Multiple email addresses are not proof of distinct
people; email verification is not complete abuse prevention.

The SDK reuses each resource for up to 900 seconds to respect the server limit.
Reuse one running connector: separate processes share the server-side key limit
but not the in-memory cache. Source observations can be older than acquisition;
always inspect timestamps and missing/stale flags. No expired cached fallback
is returned on a failed refresh. Reads across endpoints are not atomic.

This is a local stdio connector, not a hosted OAuth MCP endpoint. Directory
listing, auto-discovery, every-editor compatibility, and future publication are
not implied. No exchange credentials or live trading are supported.
