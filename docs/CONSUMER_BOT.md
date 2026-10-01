# Optional consumer bot / project support

The [ASTRO Trade Bot page](https://astro-event-horizon.vercel.app/bot) is a
separate one-time software purchase for people who want a local ASTRO client
and want to support the project. Buying the bot is **not required** to use the API.

## Published offer, checked September 30, 2026

- One-time bot purchase (the page displays $365).
- Three months of Oracle API access included in the advertised offer.
- Continued API access advertised at $9/month afterward.
- Ownership of the software does not expire with API access. Fresh intelligence
  still requires valid API access; ownership does not mean a lifetime data feed.

These are the published terms, not a new billing change. A fresh purchase,
trial provisioning, expiry and renewal have not been end-to-end reverified in
this documentation update. The inspected repository webhook sends the bot
download email but does not issue the included API key in that branch. Whether
another deployed mechanism provisions those three months still needs verification.

## Exact legacy consumer release

`ASTRO_TradeBot_v3_1_OneClick.zip`

SHA-256: `8b7166377bb7aea7749fcfcbf622dc13f55d196da0e1bbd6bb6debe67607dd8a`

This Windows package runs in **paper mode only** through its launcher. It uses
real market information but is not a live-money trading release. It reads the
same `/api/signal`, `/api/context`, and `/api/basket` routes; route compatibility
alone is not a full runtime compatibility test.

The package predates the reliability work and VPS service. Its reviewed version
has unresolved simulation accounting, partial-exit, hedge-record and stale-data
handling defects. Its scoreboard must not be treated as reliable performance
proof. Missing numeric observations in the current API can also require adapter
changes; the existing ZIP has not been certified against all current responses.

The hosted API improvements and the Python SDK in this repository do **not**
automatically update an installed v3.1 bot. No replacement ZIP is released by
this documentation change. The website's checkout download artifact has not
been hash-matched to the owner's ZIP during this review.

## Next consumer milestone

Build a separately versioned paper-only client with reconciled accounting,
current API mappings, header authentication, honest timestamps, and explicit
subscription/outage behavior. Verify clean Windows installation, full data cycles,
restart recovery and API expiry before promoting that replacement as validated.

API subscriptions and optional bot purchases are distinct products. Neither
product promises profits or a validated autonomous trading edge.
