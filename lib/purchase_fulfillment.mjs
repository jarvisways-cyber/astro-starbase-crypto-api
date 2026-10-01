import {randomBytes} from 'node:crypto';
import {BOT_PRICE_IDS, botEntitlement} from './founding_offer.mjs';

const object = raw => typeof raw === 'string' ? JSON.parse(raw) : raw;
const opaque = () => randomBytes(24).toString('hex');

export async function fulfillCheckout({event, stripe, redis, sendEmail, now = () => Date.now()}) {
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return {ignored: true};
  const session = event.data.object;
  // Test Stripe events never provision keys accepted by the live Mother.
  if (event.livemode !== true || session.livemode !== true || session.payment_status !== 'paid') return {ignored: true};
  if (typeof session.id !== 'string' || !session.id.startsWith('cs_')) throw Error('Invalid checkout');
  const email = session.customer_details?.email;
  if (typeof email !== 'string' || !email.includes('@') || /[\r\n]/.test(email)) throw Error('Missing purchaser email');
  const items = await stripe.checkout.sessions.listLineItems(session.id, {limit: 100});
  if (items.has_more || items.data.length !== 1) throw Error('Unrecognized checkout items');
  const item = items.data[0];
  const bot = BOT_PRICE_IDS.includes(item.price?.id);
  if (bot ? session.mode !== 'payment' : session.mode !== 'subscription' || !item.price?.recurring)
    throw Error('Unrecognized checkout product');
  if (bot && item.quantity !== 1) throw Error('Unsupported bot quantity');

  const purchaseId = `purchase:${session.id}`;
  let record = object(await redis.get(purchaseId));
  if (!record) {
    // Preserve an already-issued API key when replaying a legacy subscriber event.
    const legacyKey = await redis.get(`session:${session.id}`);
    const candidate = {schema: 1, session_id: session.id, email, bot, livemode: true,
      key: typeof legacyKey === 'string' ? legacyKey : `astro-starter-${opaque()}`,
      created: new Date(now()).toISOString(),
      entitlement: bot ? botEntitlement(event.created) : {kind: 'api_subscription'},
      ...(bot ? {token: opaque(), download_expires: now() + 72 * 60 * 60 * 1000} : {})};
    await redis.set(purchaseId, JSON.stringify(candidate), {nx: true});
    record = object(await redis.get(purchaseId));
  }
  if (!record || record.session_id !== session.id || record.email !== email || record.bot !== bot)
    throw Error('Purchase record mismatch');
  const keyRecord = {tier: 'starter', email, session_id: session.id, created: record.created,
    active: true, livemode: true, entitlement: record.entitlement};
  // NX prevents webhook retries from reviving administratively revoked keys.
  await redis.set(`key:${record.key}`, JSON.stringify(keyRecord), {nx: true});
  await redis.set(`session:${session.id}`, record.key);
  await redis.sadd('astro:keys', record.key);
  if (bot) await redis.set(`download_token:${record.token}`, JSON.stringify({email,
    session_id: session.id, created: record.created, expires: record.download_expires, used: false}), {nx: true});
  if (!await redis.get(`purchase_mail:${session.id}`)) {
    // Delivery failure must propagate (HTTP 500) so Stripe retries the same key.
    // SMTP is at-least-once: crash after delivery may resend, never create a new key.
    await sendEmail(record);
    await redis.set(`purchase_mail:${session.id}`, 'sent');
  }
  return {received: true}; // Never return credentials in webhook acknowledgements.
}

export function purchaseEmail(record) {
  const key = record.key;
  if (!/^astro-[a-z0-9-]+$/.test(key)) throw Error('Invalid key');
  let terms = 'Your ASTRO API subscription access is ready.';
  if (record.bot) terms = record.entitlement.kind === 'founding_supporter'
    ? 'You are an ASTRO Founding Supporter. Your purchase includes lifetime consumer-software updates and API access without an additional subscription charge for as long as ASTRO operates the API service, subject to published usage limits. The founding purchase window ending does not end your benefits.'
    : `Your purchase includes API access until ${record.entitlement.access_until}. Continued API access afterward requires a separate subscription; no automatic API billing is created by this bot purchase.`;
  const download = record.bot ? `<p><a href="https://astro-event-horizon.vercel.app/api/download?token=${encodeURIComponent(record.token)}">Download ASTRO Trade Bot</a> (link valid for 72 hours).</p><p>The current release is paper-only. Future live trading and exchange integrations depend on development and validation, with no promised delivery date.</p>` : '';
  return {to: record.email, subject: record.bot ? 'Your ASTRO Trade Bot and API Access' : 'Your ASTRO API Key',
    html: `<div style="font-family:monospace"><h1>ASTRO</h1><p>${terms}</p><p>Your private API key:</p><pre>${key}</pre>${download}<p>Access synchronization can take about one minute. Use the X-API-Key header; one request per resource per 15 minutes.</p><p><a href="https://astro-event-horizon.vercel.app/terms">Purchase terms</a> | <a href="https://github.com/jarvisways-cyber/astro-starbase-crypto-api">API documentation</a></p><p>Reply to this email for help. Do not share your key publicly.</p></div>`};
}
