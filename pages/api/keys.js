import { Redis } from '@upstash/redis';
import { createKeysHandler } from '../../lib/keys_handler.mjs';
let handler;
export default async function keys(req,res) {
  if (!handler) {
    const redis = new Redis({url:process.env.UPSTASH_REDIS_REST_URL, token:process.env.UPSTASH_REDIS_REST_TOKEN});
    handler = createKeysHandler(redis);
  }
  return handler(req,res);
}
