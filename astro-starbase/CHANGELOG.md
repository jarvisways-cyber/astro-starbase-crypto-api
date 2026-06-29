# Changelog

All notable changes to the `astro_intelligence` client and public API spec will be documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]
- Reconcile "9 signal domains" vs "11 signals" discrepancy between this README and the live access terminal copy.
- Publish formal SLA for cycle freshness / behavior when a request lands mid-cycle.
- Add `/oracle/basket` and `/oracle/risk` response schemas to `openapi.yaml` once field shapes are confirmed against production.

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
