// Alaska midnight boundaries (UTC-08 at both September boundaries).
export const FOUNDING_START = Date.parse('2026-09-30T08:00:00Z');
export const FOUNDING_END = Date.parse('2027-09-30T08:00:00Z');
export const OFFER_VERSION = 'founding-year-2026-v1';
export const BOT_PRICE_IDS = ['price_1To6gQFwvxiyT5vxlwbzhuN3', 'price_1ToVEuFwvxiyT5vxRqMLceDP'];

export function botEntitlement(paidAtSeconds) {
  if (!Number.isSafeInteger(paidAtSeconds) || paidAtSeconds <= 0) throw Error('Invalid payment time');
  const paidAt = paidAtSeconds * 1000;
  const founding = paidAt >= FOUNDING_START && paidAt < FOUNDING_END;
  // Non-cohort purchases retain the prior three-calendar-month included offer.
  const end = new Date(paidAt);
  const day = end.getUTCDate();
  end.setUTCDate(1);
  end.setUTCMonth(end.getUTCMonth() + 3);
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate();
  end.setUTCDate(Math.min(day, last));
  return {kind: founding ? 'founding_supporter' : 'bot_included_access',
    offer_version: OFFER_VERSION, paid_at: new Date(paidAt).toISOString(),
    ...(founding ? {service_lifetime_access: true, software_updates: 'lifetime'} : {access_until: end.toISOString()})};
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
