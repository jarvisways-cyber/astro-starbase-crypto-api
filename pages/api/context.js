export default async function handler(req, res) {
  const { api_key } = req.query;
  if (!api_key) return res.status(400).json({ error: "api_key required" });
  try {
    const r = await fetch(
      `https://lair-impotence-phonebook.ngrok-free.dev/oracle/context?api_key=${encodeURIComponent(api_key)}`,
      { headers: { "User-Agent": "astro-portal-proxy/1.0", "ngrok-skip-browser-warning": "1" } }
    );
    const data = await r.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "upstream unavailable", detail: String(err) });
  }
}