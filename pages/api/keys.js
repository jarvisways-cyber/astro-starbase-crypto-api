import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const secret = req.headers["x-astro-secret"];
  if (secret !== process.env.ASTRO_REGISTER_SECRET) return res.status(401).json({ error: "Unauthorized" });
  const keys = await redis.smembers("astro:keys");
  const result = {};
  for (const k of keys) {
    const val = await redis.get(`key:${k}`);
    if (val) result[k] = typeof val === "string" ? JSON.parse(val) : val;
  }
  return res.json(result);
}
