# Repository reconciliation — October 25, 2026

This is a review checkpoint, not a deployment announcement.

## Public connector and homepage

- MCP remains 0.7.1; the connector's 46 regression tests pass.
- Onboarding documents public HTTP access, Explorer, and the n8n starter.
- Homepage copy is proposed on the review branch, not deployed: it removes
  trial/payment requirements for public intelligence and qualifies score claims.
- Clean offline dependency installation and the production build passed against
  the locked Next 16.3.8 packages. Downloaded Next/SWC archives matched the lockfile's
  SHA-512 integrity values; no dependencies were downgraded. Local preview starts,
  but browser navigation was blocked by the test tool's policy. Rendered desktop
  and mobile layout checks remain outstanding. No production credentials were
  loaded; authenticated backend and payment flows were not exercised.

## Consumer distribution

The existing 3.2.0-paper release ZIP was downloaded again, checksum and internal
manifest verified, and its network-blocked self-check passed. Its mapper accepted
today's fresh ten-asset response. Nullable-input checks found compatibility gaps;
see [the consumer review](CONSUMER_BOT.md#compatibility-review--october-25-2026).
An isolated 3.2.1-paper-rc3 candidate addresses explicit unavailable auxiliary
values, supplied per-asset signal-health conflicts, and incompatible imported
history. It refuses mixed/untagged history without deleting or relabeling it.
It passes 144 offline tests and its packaged startup self-check. This does not certify all hosted
metadata semantics, authenticated polling, or sustained consumer operation.
No replacement ZIP or new consumer version has been published.

## Private runtime

The private engine repository now preserves an archival branch containing 143
hash-verified deployed Python source files, retaining the collector and API/paper
release trees separately. Another 45 support files preserve the deployed wrappers,
Explorer, separate shadow runner, route assets and legacy key-sync dependencies.
On October 26, a fresh Linux Python 3.12 environment installed 21 pinned runtime
packages from SHA-256-verified wheels. Dependency validation, archived Python
compilation and key-sync import checks passed. A credential-free effective
configuration inventory covers eight services.
This is not a complete bare-host service/data restore: credential provisioning,
installable service templates and full restore/rollback still need verification.
Private source and runtime data are excluded from this repo.

Neither main branch has been replaced. Production services, active weights, and
the frozen Module 8 forward trial are unchanged by this repository work.
