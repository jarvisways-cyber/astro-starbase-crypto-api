import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jarvisways@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "astro-starter-" + s;
}

async function sendKeyEmail(email, key) {
  await transporter.sendMail({
    from: '"ASTRO Intelligence" <jarvisways@gmail.com>',
    to: email,
    subject: "Your ASTRO API Key",
    html: `<div style="font-family:monospace;background:#0a0a0a;color:#00ff88;padding:40px;max-width:600px"><h1 style="color:#00ff88">ASTRO INTELLIGENCE</h1><p style="color:#888">Asset Sentiment Trend Risk Oracle</p><p style="color:#ccc">Your API key is ready.</p><div style="background:#111;border:1px solid #00ff88;border-radius:4px;padding:20px;margin:24px 0"><p style="color:#888;font-size:12px;margin:0 0 8px 0">YOUR API KEY</p><p style="color:#00ff88;font-size:18px;margin:0">${key}</p></div><p style="color:#ccc">Docs: <a href="https://astro-event-horizon.vercel.app/" style="color:#00ff88">astro-event-horizon.vercel.app</a></p><hr style="border-color:#222;margin:32px 0"/><p style="color:#444;font-size:12px">Lost this email? Reply with your payment receipt and we will resend your key.</p></div>`,
  });
}

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let event;
  try {
    const raw = await getRawBody(req);
    const sig = req.headers["stripe-signature"];
    const secrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_WEBHOOK_SECRET_TEST].filter(Boolean);
    let lastErr;
    for (const secret of secrets) {
      try { event = stripe.webhooks.constructEvent(raw, sig, secret); break; } catch (e) { lastErr = e; }
    }
    if (!event) return res.status(400).json({ error: lastErr.message });
  } catch (err) { return res.status(400).json({ error: err.message }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status !== "paid") return res.json({ received: true });
    const email = session.customer_details?.email || "unknown";
    const key = generateKey();
    await redis.set(`key:${key}`, JSON.stringify({ tier: "starter", email, session_id: session.id, created: new Date().toISOString(), active: true }));
    await redis.set(`session:${session.id}`, key);
    await redis.sadd("astro:keys", key);
    console.log("[ASTRO] Key stored in Redis:", key, email);
    try {
      await sendKeyEmail(email, key);
      console.log("[ASTRO] Key email sent to:", email);
    } catch (emailErr) {
      console.error("[ASTRO] Email delivery failed:", emailErr.message);
    }
    return res.json({ received: true, key, email });
  }
  res.json({ received: true });
}
