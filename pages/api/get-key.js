import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id required" });
  try {
    const keys = await redis.smembers("astro:keys");
    for (const k of keys) {
      const val = await redis.get(`key:${k}`);
      const meta = typeof val === "string" ? JSON.parse(val) : val;
      if (meta?.session_id === session_id) {
        return res.json({ key: k, tier: meta.tier, email: meta.email });
      }
    }
    return res.status(404).json({ error: "Key not found. Payment may still be processing - try again in 30 seconds." });
  } catch (err) {
    return res.status(500).json({ error: "Lookup failed", detail: String(err) });
  }
}
