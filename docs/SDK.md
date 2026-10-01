# Python SDK 0.2.0 (source release)

Install a checkout with `python -m pip install .` (Python 3.10+). Version 0.2.0
has not been published to PyPI; `pip install astro-intelligence` may fetch an older
release. Use the local masked prompts in `examples/quickstart.py` or
`examples/scan_open_gates.py`. Do not paste credentials into source or commands.

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

Verification uses mocked hosted responses and offline tests; no new live-key
SDK cycle or PyPI release is claimed. Existing live HTTP route checks are
separate deployment evidence.
