# Python SDK 0.7.1 (source release)

Install this checkout with `python -m pip install .` (Python 3.10+).
This source release is not published to PyPI; install the checkout rather than assuming a same-named registry package is current.

## Public access

No signup or API key is required for public intelligence:

```python
from astro_intelligence import ASTRO

with ASTRO(public_access=True) as client:
    snapshot = client.snapshot()
```

Public mode uses `/api/public/signal`, `/api/public/context`, and `/api/public/basket`.
The default keyed mode is retained for compatibility and uses the authenticated routes below.
Do not paste credentials into source, commands, or URLs. Both modes preserve freshness and missing-data indicators; neither executes trades.

## Routes and views

| Method | Hosted request / view |
|---|---|
| `signal()` / `composite()` / `signals()` | `/api/signal`: raw / typed / components |
| `context()` / `regime()` | `/api/context`: raw context |
| `basket()` / `assets()` / `gate(symbol)` / `prices()` | `/api/basket`: raw / derived views |
| `snapshot()` | All three resources, once each |

Snapshot requests are sequential, not atomic; compare their timestamps.
The raw methods preserve additive fields. Typed models retain the underlying
record in `.raw`; missing numeric values remain `None`, not neutral scores.
For prices and gates, inspect quote/observation timestamps and stale flags in
`basket()` before making decisions. This library does not execute orders.

## Caching and errors

Reuse one client instance. Each resource is cached for 900 seconds from a
successful response. Derived views share that cache, including repeated gate
lookups. Each return is independent of caller mutations. This synchronous client
is intended for serial use; cache/rate coordination across processes or threads
is not provided. Cache age is not an upstream freshness guarantee.

An expired-cache refresh failure raises; it does not silently serve old data.
Authentication rejection clears cached views. Responses preserve server stale
flags rather than declaring cached or fresh responses safe to trade.

Redirects are disabled. Keys travel in headers, not URLs. Errors do not echo
response bodies. Rate-limit errors expose a numeric retry delay; malformed or
non-numeric Retry-After defaults to 900 seconds. The library does not retry
automatically. Use a context manager or `close()` to release its session.

## Changes from the earlier alpha

- Base URL is the HTTPS website origin, not `/api/signal`.
- No requests append `/oracle/*` to a website route.
- `history()`, `risk()` and `congress()` now explicitly report unsupported hosted
  detail rather than sending requests to nonexistent public routes. Congress's
  composite input is available in signal/context; private execution risk is not.
- `regime()` returns the documented context response, not the old draft shape.
- `wait_for_next_cycle()` requires at least 900 seconds between polls.
- The core OpenAPI document replaces the earlier unverified backend-route draft.

Verification includes offline regression tests and credential-free live MCP calls. No new authenticated-key SDK cycle or PyPI release is claimed.
