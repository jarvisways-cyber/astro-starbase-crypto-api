# Changelog

All notable changes to the `astro_intelligence` client and public API spec will be documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.2.0] ? 2026-09-30 (source only; not published to PyPI)
- SDK routes to `/api/signal`, `/api/context` and `/api/basket` on the website origin.
- Shared per-resource 900-second cache for typed views; raw payloads retain quality
  metadata and null observations. Expired refresh errors do not return old data.
- Redirects disabled; sanitized errors, robust rate-limit handling and session cleanup.
- Unexposed backend methods now report unsupported detail explicitly.
- Core OpenAPI contract and examples aligned; Python 3.10 minimum declared.
- Documented the optional one-time legacy paper-bot offer separately from API access.
- 26 offline tests passed; source installation and dependency consistency verified.
- No PyPI release, consumer ZIP replacement, billing or live-service change.

## [2026-09-30] ? VPS API documentation
- Documented the verified hosted signal/context/basket routes, header authentication,
  per-resource polling, calculation explanations and data-quality limitations.
- Added a dependency-free snapshot example with three offline regression tests.
- Preserved the previous README as historical context; kept the alpha client,
  draft schema, license, website, checkout and email implementation unchanged.
- Existing alpha client and OpenAPI contract still need compatibility updates.

## [Unreleased]
- Reconcile remaining legacy website marketing with the documented nine components plus auxiliary intelligence.
- Publish formal SLA for cycle freshness / behavior when a request lands mid-cycle.
- Expand optional intelligence schemas from verified responses; do not advertise unexposed backend routes.

## [0.1.0] — 2026-06-29
### Added
- Initial public scaffold of `astro_intelligence` Python client (`ASTRO` class) covering all 10 documented endpoints.
- Typed response models (`CompositeReading`, `AssetGate`, `AssetSnapshot`) instead of raw dicts.
- `openapi.yaml` draft spec covering composite, signals, assets, regime, risk, prices, congress, history, gate, and basket endpoints.
- Error handling: `ASTROAuthError`, `ASTRORateLimitError`, `ASTROCycleNotReadyError`.
- Example scripts: `quickstart.py`, `scan_open_gates.py`, `poll_and_log.py`.
- Mocked unit test suite (`tests/test_client.py`) — no live API key required to run.
- MIT `LICENSE` for the client library and documentation.

### Notes
- This is an alpha release of the *client and spec*, scaffolded to match the documented API surface. Field names and error shapes should be verified against live production responses before relying on them for trading decisions.
