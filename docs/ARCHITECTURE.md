# ASTRO architecture and research lineage

The earlier front page contained useful architectural explanations and research
history. This guide preserves those concepts while distinguishing the hosted
API from experimental trading behavior. The original page remains in Git history.

## Current customer path

```text
Market sources -> Mother collection -> recorded intelligence -> authenticated API
                                                               |
                                           dashboards, research, alerts, bots
```

The original website handles purchases, key issuance and email delivery. The
customer registry synchronizes access to Mother. Customers consume JSON; they do
not need ASTRO's execution engine. See [API documentation](API.md).

Collection, API delivery, key synchronization and internal paper execution are
separate supervised services. Paper execution can stop without stopping market
collection. Customer endpoints expose analysis, not customer trading accounts.

## Trading architecture behind the research

The original design separated several responsibilities:

| Layer | Intended responsibility |
|---|---|
| Oracle | Aggregate and interpret market observations |
| Portfolio/risk governance | Set regime-dependent eligibility and exposure controls |
| Director and signal gates | Evaluate strategy conditions and asset eligibility |
| Vanguard | Manage entries, positions and exits |
| Shield | Evaluate defensive actions and protection |
| Sniper / Gambler concepts | Precision and tie-breaking logic in the historical design |

These names describe architectural roles, not evidence that every historical
feature is enabled in the current release. The separate project archive
is not the deployed production source. Internal execution remains paper-only.

## Scores are not probabilities

Ascendancy summarizes asset intelligence. Velocity is a change in that score,
not a percentage price return. The API provides component weights, contributions,
adjustment stages and decision explanations so consumers can inspect the inputs.
Neither a composite score nor strategy confidence is a calibrated probability
of a profitable trade. Upstream observations can be missing or use fallbacks.

## Research and learning

Earlier backtests explored specific simplified policies and subsets of signals.
Their results are retained in [historical performance notes](HISTORICAL_OVERVIEW.md),
not presented as validation of today's complete system.

Module 8 evaluates candidate weights separately; it does not automatically
replace published weights. Hive's intended role is to collect attributable
outcomes and support validated improvements. A fully autonomous recursive
strategy service remains a development goal, not a current product promise.

For current integration instructions and dated deployment checks, use the
[main guide](../README.md), rather than legacy SDK examples or tunnel addresses.
