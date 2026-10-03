# ASTRO hosted API guide

Contract documented September 30, 2026. Base URL:
`https://64.227.50.56`

## Access and polling

The advertised customer plan is **$9/month for full ASTRO API access**.
Obtain access through the website. Send an `X-API-Key` header; no query-string
credential is needed. Keep keys out of browser-delivered code.

Supported website routes documented here: `/api/signal`, `/api/context`, and
`/api/basket`. Old `/oracle/*` examples describe backend paths; do not append
them to this website origin or use obsolete tunnel URLs.

Each resource allows **one request per 900 seconds per key**. Fetch all three
once per cycle and cache them. Context does not consume the signal or basket
allowance. Do not rapidly retry a rate-limited request.

| Status | Client behavior |
|---|---|
| `200` | Parse JSON and inspect stale/missing/quality fields. |
| `401` | Missing/invalid authentication; check access privately. |
| `403` | Access denied; do not assume retries grant access. |
| `429` | Poll allowance exceeded; wait before requesting that resource again. |
| `5xx` | Service/upstream unavailable; back off and mark cached data stale. |

Ignore unknown additive fields. Do not replace missing values with plausible
zeroes or neutral classifications.

## Signal — `GET /api/signal`

Key fields: `composite`, `regime`, `shift`, `signals`, `btc_price`,
`btc_price_observed_at`, and `last_updated`. Zero shift means no measured change;
null means no valid comparison. Quote and intelligence times can differ.

## Context — `GET /api/context`

Legacy context fields remain. Expanded objects:

### `signal_explanation`

- `components`: `fng`, `mkt_struct`, `funding`, `liquidity`, `macro`, `onchain`,
  `options`, `narrative`, `congress`.
- Each component has `score`, `weight`, `inverted`, `adjusted_score`,
  `contribution`, and a source-quality annotation.
- `base_composite`: component contribution sum, before subsequent adjustments.
- `adjustments`: sequential trend, funding, narrative velocity, confluence and
  time-of-day steps. Each reports its result, including clamping.
- `published_composite`: the existing published post-trend score.
- `asset_adjustment_composite`: the later adjusted value used for asset scoring.
- `asset_score_shift`: the shift applied to asset prediction-market intelligence.

**These stages differ intentionally.** The final adjustment result need not equal
the published composite. Preserve the labels rather than treating them as synonyms.

### `market_intelligence`

- `assets`: per-symbol `change_24h` (percent), `volume_24h` (USD) and `btc_vol` (USD).
- `ranking`: observed assets ordered by 24-hour change, not a portfolio allocation.
- `breadth_score`: observed non-BTC assets outperforming BTC.
- `breadth_denominator`: observed non-BTC comparison count; normally nine.
- `breadth_assets`, `breadth_label`, `complete`, `missing_assets`: coverage.
- `received_at`, `timestamp_kind`, `age_seconds`, `stale`, `available`: acquisition
  and availability. Receipt time is not an exchange timestamp.

Rankings refresh approximately every 900 seconds and expire after 1200 seconds.
Failed refreshes mark them unavailable. Partial baskets have no whole-basket
breadth label; missing data is not proof of a BTC-only market.

### `intelligence`

| Field | Meaning |
|---|---|
| `observation` | Collector processing time, age and stale flag |
| `context` | Momentum/sentiment, OI/stablecoin scores, 4h trend, funding/narrative/confluence, volume and session context |
| `missing_context` | Context fields absent from the snapshot |
| `per_asset_funding_scores` | Funding analysis by asset |
| `open_interest` | Stored exchange-specific OI quantities; not universally USD |
| `stablecoin_supply` | Stored USDT/USDC/total supply |
| `prediction_market_macro` | Available macro prediction-market summary |
| `moving_averages` | Per-asset SMA200 prices |
| `atr_observations` | Daily simple ATR14 fractional observations and provenance; `0.04` means 4% |
| `candles` | Pattern-scoring details and processing metadata |
| `quality` | Explicit source-freshness and fallback limitations |

These summaries are not a raw exchange-data archive or a complete replay dataset.

## Basket — `GET /api/basket`

`basket` maps assets to assessments; `open_assets`/`open_count` summarize analytical
gates. Per-asset fields include:

- `price`, `price_observed_at`, `price_stale`, `sma200`, `above_sma200`.
- `ascendancy`, `velocity`, `last_updated`, `stale`.
- `funding_score`, candle summary and optional ATR observations.
- `gate`, `strategy`, `confidence`.
- `decision`: availability, reasoning, dimension checks, matched/total counts,
  veto, veto reason and confidence interpretation.

Old/invalid quotes become unavailable. Missing BTC market inputs or first-cycle
shift can prevent strategy eligibility. Portfolio exposure and cooldown are
separate execution controls; public analytical gates do not promise trades.

## Quality and research boundaries

`source_freshness=not_independently_verified` and `fallbacks_possible=true` are
meaningful. A new collection cycle does not prove every source refreshed. A score
of 50 alone does not prove source health or failure.

No customer order execution occurs through these endpoints. Paper trading and
shadow learning are separate. Operational tests and historical research do not
establish guaranteed returns.
