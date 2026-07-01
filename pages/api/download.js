import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  const raw = await redis.get(`download_token:${token}`);
  if (!raw) return res.status(404).send("Invalid or expired download link");

  const data = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (Date.now() > data.expires) {
    return res.status(410).send("This download link has expired. Reply to your receipt email for a new one.");
  }

  const repo = process.env.GITHUB_RELEASE_REPO;
  const tag = process.env.GITHUB_RELEASE_TAG;
  const pat = process.env.GITHUB_PAT;

  let releaseRes;
  try {
    releaseRes = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${tag}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: "application/vnd.github+json",
      },
    });
  } catch (err) {
    console.error("[ASTRO] GitHub release fetch failed:", err.message);
    return res.status(502).send("Could not reach file storage. Try again shortly.");
  }

  if (!releaseRes.ok) {
    console.error("[ASTRO] GitHub release lookup failed:", releaseRes.status);
    return res.status(502).send("Could not locate release file.");
  }

  const release = await releaseRes.json();
  const asset = release.assets?.[0];
  if (!asset) return res.status(404).send("No file attached to this release.");

  let assetRes;
  try {
    assetRes = await fetch(asset.url, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("[ASTRO] GitHub asset fetch failed:", err.message);
    return res.status(502).send("Could not download file. Try again shortly.");
  }

  if (!assetRes.ok) {
    console.error("[ASTRO] GitHub asset download failed:", assetRes.status);
    return res.status(502).send("Could not download file.");
  }

  data.used = true;
  await redis.set(`download_token:${token}`, JSON.stringify(data));

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${asset.name}"`);

  const buffer = Buffer.from(await assetRes.arrayBuffer());
  res.send(buffer);
}