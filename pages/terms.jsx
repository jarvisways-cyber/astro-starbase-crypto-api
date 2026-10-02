export default function Terms() {
  return <main style={{background:"#0a0a0a",color:"#ddd",padding:"2rem",fontFamily:"monospace",maxWidth:900,margin:"auto",lineHeight:1.7}}>
    <h1>ASTRO Terms of Service</h1>
    <p>Effective September 30, 2026. ASTRO provides informational market analysis, not financial advice or guaranteed trading outcomes.</p>
    <h2>Founding Supporter offer</h2>
    <p>A qualifying paid one-time ASTRO Trade Bot purchase from September 30, 2026 at 00:00 through September 29, 2027 at 23:59:59, America/Anchorage time, qualifies for the founding cohort. Eligibility uses Stripe’s verified successful-payment event time, not the time our server receives a webhook. Test-mode and unpaid transactions do not qualify.</p>
    <p>Founding supporters receive the current paper-trading beta, lifetime updates to the consumer software, and API access at no additional subscription charge for as long as ASTRO operates its API service. The end of the purchase window does not end a qualifying supporter’s benefits. No automatic API subscription is created by a bot purchase.</p>
    <p>Included access is for the purchaser’s use and is subject to the same published API usage limits as the full-access plan: currently one request per resource per 900 seconds per key. Keep keys private. This does not promise unlimited throughput, a particular uptime level, or that the service will operate forever.</p>
    <p>Software updates cover future consumer releases as developed and released. Live-money trading, broader exchange integrations and Hive research remain development goals, not guaranteed features or delivery dates. Testing, feedback and future Hive participation are voluntary. The current bot executes simulated orders only.</p>
    <h2>Other purchases and existing subscriptions</h2>
    <p>Outside the founding window, bot purchases include three calendar months of API access, after which continued data access requires a separately chosen subscription. Owning the software is distinct from having active data access. Existing standalone API subscriptions and their billing are not automatically canceled or changed by purchasing the bot. Contact support if you have both so billing can be reviewed; no duplicate-charge refund is promised here.</p>
    <p>Access remains subject to payment validity and applicable consumer rights. An expired download link does not end software ownership or a valid founding entitlement. Reply to your purchase email for delivery help. Nothing in these terms limits rights required by applicable law.</p>
    <h2>Availability and interpretation</h2>
    <h2>Free API trials</h2>
    <p>Self-service trials require email verification and consent to account-delivery emails. One 30-day trial per normalized email address, including any previous invited trial; reconnecting or reinstalling does not renew it. The period begins at successful activation, not the first API request. No payment card, automatic charge, subscription, or social engagement is required. Access uses normal API limits and may take up to five minutes to activate, expire, or reflect revocation. Abuse controls may temporarily limit signup. Existing paid and founding access is not replaced by a trial. Your API key must remain private.</p>
    <p>The service is provided as-is. Inspect timestamps, missing-data and quality fields. Scores are derived assessments, not calibrated winning probabilities. A service failure or stale observation must not be treated as fresh market information.</p>
    <p><a href="https://github.com/jarvisways-cyber/astro-starbase-crypto-api/blob/main/docs/API.md">API documentation and limits</a> · <a href="/bot">Trade Bot</a> · <a href="/">ASTRO API</a></p>
  </main>;
}
