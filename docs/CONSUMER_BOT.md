# Optional consumer bot / project support

The [ASTRO Trade Bot](https://64.227.50.56/bot) is a separate
one-time software purchase. Buying it is **not required** to use the API.

## Current release: 3.2.0-paper

`ASTRO_TradeBot_v3_2_Paper.zip`

SHA-256: `1775907cc4925127dc97e863b14406ac2e9ff45d60af5425056e2203f964f012`

The paid release repository now serves this artifact instead of v3.1. The
existing `v1.0` tag is retained for purchase-link compatibility, not as the
software version. The original ZIP is preserved separately for rollback.

### What changed

- Fill-driven paper accounting, guarded entry and restart recovery.
- Current hosted signal/context/basket mappings and header authentication.
- Timestamp-aware observations and hosted rankings; no owner CoinGecko key needed.
- Locally encrypted ASTRO API-key setup and isolated Python dependencies.
- Visible engine and Watch consoles. Optional AI helpers do not auto-start.

Windows and Python 3.12+ are required. Extract into a **new folder** and run
`RUN_ASTRO.bat`; preserve your old installation. No old-account migration is included.

**No Kraken credentials are required or collected. Real-money orders are disabled.**
The exchange adapter is retained for a future, separately validated opt-in live
release. Multi-exchange support is a roadmap, not a current feature. Hive uploads
and automatic strategy promotion remain disabled.

### Verification and limitations

134 offline regression tests passed. Clean dependency installation, packaged
offline startup, downloaded GitHub bytes and file hashes were checked. Current
hosted responses passed a three-endpoint, ten-asset adapter check with zero orders.
Independent-PC certification and sustained paper performance remain outstanding.
No profitability or calibrated winning-probability claim is made.

## Purchase and API access

### Compatibility review — October 25, 2026

The downloaded 3.2.0-paper ZIP still matches the SHA-256 above and its internal
file manifest. Its offline self-check passed with networking blocked, and its
response mapper accepted a fresh ten-asset public API capture. This tests the
mapping only, not the package's authenticated polling or an end-to-end trading run.

It is **not fully aligned with every current missing-data response**. In isolated
mapper checks, an explicitly unavailable nested open-interest score became the
legacy neutral value 50, while a null regime score raised a validation error.
The existing polling error path marks data unavailable, but that does not repair
the neutral-value substitution. A separately tested consumer update is required.
The ZIP has not been replaced, and it does not contain the newer hosted engine
or Module 8 changes. Do not infer consumer compatibility from VPS deployment status.

The one-time bot price remains $365. Paid purchases in the founding year,
September 30, 2026 through September 29, 2027 (Alaska time), include lifetime
consumer-software updates and full API-plan access at no additional subscription
charge for as long as ASTRO operates the service, subject to published usage limits.
The purchase window ending does not end those benefits.

See [Founding Supporter details](FOUNDING_SUPPORTERS.md) and the
[terms](https://64.227.50.56/terms). Outside that window, the
standard included API period is three calendar months. The standalone API
subscription remains separate. Existing subscriptions are not automatically canceled.

Webhook fulfillment now issues the bot download and API key together, reusing the
same key on retries. Automated fixture tests cover cohort boundaries, retries,
revocation preservation and access export. No fresh real purchase or customer
email was sent as part of those tests.
