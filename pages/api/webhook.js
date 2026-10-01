import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";
import {fulfillCheckout, purchaseEmail} from "../../lib/purchase_fulfillment.mjs";

export const config = {api: {bodyParser: false}};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  let event, stripe;
  try {
    const chunks=[];
    for await (const chunk of req) chunks.push(chunk);
    const raw=Buffer.concat(chunks);
    const signature=req.headers['stripe-signature'];
    for (const [secret, key, live] of [
      [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_SECRET_KEY, true],
      [process.env.STRIPE_WEBHOOK_SECRET_TEST, process.env.STRIPE_SECRET_KEY_TEST, false],
    ]) {
      if (!secret || !key) continue;
      try {
        const client=new Stripe(key);
        const verified=client.webhooks.constructEvent(raw, signature, secret);
        if (verified.livemode !== live) continue;
        event=verified;
        stripe=client;
        break;
      } catch { /* Try the other configured signing context. */ }
    }
    if (!event) return res.status(400).json({error: 'Invalid signature'});
  } catch { return res.status(400).json({error: 'Invalid request'}); }
  try {
    const redis=new Redis({url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN});
    const result=await fulfillCheckout({event, stripe, redis, sendEmail: async record => {
      const transport=nodemailer.createTransport({service: 'gmail', auth: {
        user: 'jarvisways@gmail.com', pass: process.env.GMAIL_APP_PASSWORD}});
      await transport.sendMail({from: '"ASTRO Intelligence" <jarvisways@gmail.com>', ...purchaseEmail(record)});
    }});
    return res.json(result);
  } catch {
    console.error('[ASTRO] Purchase fulfillment incomplete; retry required');
    return res.status(500).json({error: 'Fulfillment pending; retry required'});
  }
}
