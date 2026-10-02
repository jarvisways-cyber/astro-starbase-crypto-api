import { timingSafeEqual } from 'node:crypto';
import {exportEntitlement} from './founding_offer.mjs';

// Inject Redis to test authorization without accessing customer accounts.
export function createKeysHandler(redis, getSecret = () => process.env.ASTRO_REGISTER_SECRET) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') return res.status(405).json({error:'method not allowed'});
    const expected = getSecret();
    if (typeof expected !== 'string' || !expected.trim())
      return res.status(503).json({error:'access service not configured'});
    const supplied = req.headers['x-astro-secret'];
    if (typeof supplied !== 'string' || !supplied ||
        Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
        !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)))
      return res.status(401).json({error:'Unauthorized'});
    try {
      const keys = await redis.smembers('astro:keys');
      if (!Array.isArray(keys)) throw Error();
      const result = Object.create(null);
      for (const key of keys) {
        if (typeof key !== 'string' || !key.trim() || key.length > 512) throw Error();
      }
      // Upstash REST: one request per batch rather than one per customer.
      for (let offset=0;offset<keys.length;offset+=250) {
       const batch=keys.slice(offset,offset+250);
       const records=typeof redis.mget==='function'
         ? await redis.mget(...batch.map(key=>`key:${key}`))
         : await Promise.all(batch.map(key=>redis.get(`key:${key}`)));
       if(!Array.isArray(records)||records.length!==batch.length)throw Error();
       for(let i=0;i<batch.length;i++) {
        const key=batch[i],raw=records[i];
        if (raw == null) continue; // Deleted/revoked records must not be revived.
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        // This authenticated administrative route preserves registry roles.
        // Customer-only authorization belongs to Mother's mirror boundary.
        if (typeof value !== 'string' && (value === null || typeof value !== 'object' || Array.isArray(value))) throw Error();
        const exported = exportEntitlement(value);
        if (exported !== null) result[key] = exported;
       }
      }
      return res.status(200).json(result);
    } catch {
      return res.status(503).json({error:'access service unavailable'});
    }
  };
}
