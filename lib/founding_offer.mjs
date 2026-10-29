// Alaska midnight boundaries (UTC-08 at both September boundaries).
export const FOUNDING_START = Date.parse('2026-09-30T08:00:00Z');
export const FOUNDING_END = Date.parse('2027-09-30T08:00:00Z');
export const OFFER_VERSION = 'bot-lifetime-api-2026-v2';
export const BOT_PRICE_IDS = ['price_1To6gQFwvxiyT5vxlwbzhuN3', 'price_1ToVEuFwvxiyT5vxRqMLceDP'];

export function botEntitlement(paidAtSeconds) {
  if (!Number.isSafeInteger(paidAtSeconds) || paidAtSeconds <= 0 ||
      !Number.isFinite(new Date(paidAtSeconds * 1000).getTime())) throw Error('Invalid payment time');
  return {kind: 'bot_lifetime_access', offer_version: OFFER_VERSION,
    paid_at: new Date(paidAtSeconds * 1000).toISOString(),
    service_lifetime_access: true, software_updates: 'lifetime',
    integration_scope: 'any_compatible_client'};
}

// Administrative export remains compatible with Mother's existing tier-only mirror.
// Timed entitlements can remain cached for at most the mirror's five-minute TTL.
export function exportEntitlement(value, now = Date.now()) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return value;
  if (value.livemode === false) return null;
  const until = value.entitlement?.access_until;
  if (until !== undefined && (typeof until !== 'string' || !Number.isFinite(Date.parse(until)) || Date.parse(until) <= now)) return null;
  return value;
}
