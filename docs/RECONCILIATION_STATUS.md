# Repository reconciliation — October 25, 2026

This is a review checkpoint, not a deployment announcement.

## Public connector and homepage

- MCP remains 0.7.1; the connector's 46 regression tests pass.
- Onboarding documents public HTTP access, Explorer, and the n8n starter.
- Homepage copy is proposed on the review branch, not deployed: it removes
  trial/payment requirements for public intelligence and qualifies score claims.
- Homepage JSX transformed successfully using an existing Next 16.2.9 toolchain.
  A full build against this repository's locked Next 16.3.8 dependencies remains
  unverified: dependency installation stalled before completing. No dependencies
  were downgraded to make the check pass. Browser layout checks remain outstanding.

## Consumer distribution

The existing 3.2.0-paper release ZIP was downloaded again, checksum and internal
manifest verified, and its network-blocked self-check passed. Its mapper accepted
today's fresh ten-asset response. Nullable-input checks found compatibility gaps;
see [the consumer review](CONSUMER_BOT.md#compatibility-review--october-25-2026).
An isolated 3.2.1-paper-rc2 candidate addresses explicit unavailable auxiliary
values and supplied per-asset signal-health conflicts. It passes 139 offline
tests and its packaged startup self-check. This does not certify all hosted
metadata semantics, authenticated polling, or sustained consumer operation.
No replacement ZIP or new consumer version has been published.

## Private runtime

The private engine repository now preserves an archival branch containing 143
hash-verified deployed Python source files, retaining the collector and API/paper
release trees separately. Another 31 source files preserve the deployed wrappers,
Explorer and separate shadow runner, including their available tests. An installed
Python package inventory is captured, but is not a reproducible lockfile.
Service templates, complete regression coverage and clean restoration still
need verification. Private source and runtime data are excluded from this repo.

Neither main branch has been replaced. Production services, active weights, and
the frozen Module 8 forward trial are unchanged by this repository work.
