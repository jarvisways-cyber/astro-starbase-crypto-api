import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");
  const [oracle, setOracle] = useState(null);
  const [oracleErr, setOracleErr] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchOracle = async () => {
      try {
        const r = await fetch("/api/signal?api_key=dev-key-001");
        if (!r.ok) throw new Error("bad status");
        const d = await r.json();
        setOracle(d);
        setOracleErr(false);
      } catch {
        setOracleErr(true);
      }
    };
    fetchOracle();
    const id = setInterval(fetchOracle, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>A.S.T.R.O. // ACCESS TERMINAL</title>
        <meta name="description" content="Asset Sentiment Trend Risk Oracle" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0d0d0d;
          color: #c8c8c8;
          font-family: "Share Tech Mono", "Courier New", monospace;
          font-size: 17px;
          font-weight: 600;
          min-height: 100vh;
          padding: 16px 20px;
          display: flex;
          justify-content: center;
        }
        .terminal { max-width: 960px; width: 100%; text-align: center; }
        .top-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          color: #666;
          border: 1px solid #333;
          border-bottom: none;
          padding: 4px 10px;
          font-size: 17px;
        }
        .top-bar .g { color: #c8c8c8; }
        .main-frame {
          border: 1px solid #333;
          padding: 10px 12px;
          display: flex;
          gap: 0;
          align-items: center;
          justify-content: center;
        }
        .line-nums {
          color: #444;
          font-size: 17px;
          padding-right: 14px;
          display: flex;
          flex-direction: column;
        }
        .line-nums span { display: block; line-height: 1.95; }
        .astro-logo {
          font-family: "Press Start 2P", monospace;
          font-size: clamp(40px, 8vw, 82px);
          color: #f5c518;
          line-height: 1.15;
          letter-spacing: 2px;
          flex: 1;
          text-align: center;
        }
        .vdiv { border-left: 1px solid #333; margin: 0 16px; }
        .acronym-bar {
          border: 1px solid #333;
          border-top: none;
          padding: 5px 10px;
          font-size: 17px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hl-gold   { color: #f5c518; }
        .hl-green  { color: #00ff41; }
        .hl-cyan   { color: #00e5ff; }
        .hl-red    { color: #ff4444; }
        .hl-purple { color: #cc88ff; }
        .wh { color: #c8c8c8; }
        .br { color: #444; }
        .owl-row {
          border: 1px solid #333;
          border-top: none;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 15px;
        }
        .owl-box {
          color: #f5c518;
          line-height: 1;
          white-space: pre;
          font-size: 17px;
          text-align: center;
        }
        .tagline { color: #999; letter-spacing: 1px; font-size: 17px; }
        .tagline .tw { color: #c8c8c8; }
        .section-header {
          border: 1px solid #333;
          border-top: none;
          padding: 3px 10px;
          font-size: 17px;
          color: #666;
        }
        .mission-row {
          border: 1px solid #333;
          border-top: none;
          padding: 3px 10px;
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .arr-identify { color: #00ff41; }
        .arr-enter    { color: #00e5ff; }
        .arr-protect  { color: #ff4444; }
        .arr-capture  { color: #f5c518; }
        .kw-identify { color: #00ff41; min-width: 70px; display: inline-block; }
        .kw-enter    { color: #00e5ff; min-width: 70px; display: inline-block; }
        .kw-protect  { color: #ff4444; min-width: 70px; display: inline-block; }
        .kw-capture  { color: #f5c518; min-width: 70px; display: inline-block; }
        .kw-r { color: #ff4444; }
        .kw-y { color: #f5c518; }
        .kw-g { color: #00ff41; }
        .muted { color: #888; }
        .event-key-section {
          border: 1px solid #333;
          border-top: none;
          padding: 6px 10px;
        }
        .ev-hdr { font-size: 17px; color: #666; margin-bottom: 5px; }
        .badge-row { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 4px; justify-content: center; }
        .badge {
          font-size: 16px;
          padding: 4px 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: bold;
        }
        .b-green  { background: #007700; color: #000; }
        .b-red    { background: #bb0000; color: #fff; }
        .b-purple { background: #5500bb; color: #fff; }
        .b-blue   { background: #003388; color: #aac8ff; }
        .b-gold   { background: #333300; color: #f5c518; border: 1px solid #665500; }
        .b-green2 { background: #003300; color: #00ff41; border: 1px solid #005500; }
        .b-gray   { background: #1a1a1a; color: #aaa; border: 1px solid #444; }
        .b-warn   { background: #332200; color: #f5c518; border: 1px solid #554400; }
        .bottom-bar {
          border: 1px solid #333;
          border-top: none;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-size: 17px;
          color: #666;
        }
        .live-dot  { color: #00ff41; }
        .live-time { color: #00ff41; }
        .about-section {
          margin-top: 14px;
          border: 1px solid #333;
          padding: 16px 20px;
          font-size: 17px;
          line-height: 1.7;
          color: #bbb;
          text-align: left;
        }
        .about-section p { margin-bottom: 10px; }
        .about-section .em { color: #f5c518; }
        .about-section .gr { color: #00ff41; }
        .about-section ul {
          list-style: none;
          padding: 0;
          margin: 10px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          justify-content: center;
        }
        .about-section li::before { content: "â€¢ "; color: #555; }
        .dev-section {
          margin-top: 14px;
          border: 1px solid #333;
          padding: 20px 24px;
          text-align: left;
        }
        .dev-header {
          color: #f5c518;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .dev-subtext {
          color: #999;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .dev-subtext span { color: #c8c8c8; }
        .code-block {
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-left: 3px solid #333;
          padding: 14px 16px;
          margin-bottom: 16px;
          font-size: 15px;
        }
        .code-label {
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .code-label .lang { color: #00e5ff; }
        .c-comment { color: #555; }
        .c-cmd     { color: #00ff41; }
        .c-pkg     { color: #c8c8c8; }
        .c-kw      { color: #cc88ff; }
        .c-cls     { color: #f5c518; }
        .c-var     { color: #c8c8c8; }
        .c-str     { color: #00e5ff; }
        .c-fn      { color: #00ff41; }
        .c-key     { color: #ff9944; }
          margin-top: 14px;
          border: 1px solid #554400;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .cta-label { color: #888; font-size: 17px; }
        .cta-label span { color: #f5c518; }
        .cta-btn {
          font-family: "Press Start 2P", monospace;
          font-size: 12px;
          background: #f5c518;
          color: #000;
          border: none;
          padding: 12px 22px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 1px;
        }
        .cta-btn:hover { background: #fff; }
      `}</style>

      <div className="terminal">

        <div style={{textAlign:"right",marginBottom:"8px"}}>
          <a href="/bot" style={{fontFamily:"Share Tech Mono,monospace",fontSize:"0.65rem",color:"#FFB800",textDecoration:"none",border:"1px solid #FFB800",padding:"0.2rem 0.6rem",letterSpacing:"2px"}}>→ ASTRO TRADE BOT</a>
        </div>
        <div className="top-bar">
          <span>
            <span className="br">â€”[ </span><span className="g">SYS::ONLINE</span>
            <span className="br"> ]â€”[ </span><span className="g">GATE::ARMED</span>
            <span className="br"> ]â€”[ </span><span className="g">ORACLE::ACTIVE</span>
            <span className="br"> ]â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”</span>
          </span>
          <span><span className="br">[ </span><span className="g">v4:20</span><span className="br"> ]â€”</span></span>
        </div>

        <div className="main-frame">
          <div className="line-nums">
            <span>01</span><span>02</span><span>03</span>
            <span>04</span><span>05</span><span>06</span>
          </div>
          <div className="astro-logo">A.S.T.R.O.</div>
        </div>

        <div className="acronym-bar">
          <span className="br">â€”[ </span><span className="hl-gold">A</span><span className="wh">sset</span>
          <span className="br"> ]â€”â€”[ </span><span className="hl-green">S</span><span className="wh">entiment</span>
          <span className="br"> ]â€”â€”[ </span><span className="hl-cyan">T</span><span className="wh">rend</span>
          <span className="br"> ]â€”â€”[ </span><span className="hl-red">R</span><span className="wh">isk</span>
          <span className="br"> ]â€”â€”[ </span><span className="hl-purple">O</span><span className="wh">racle</span>
          <span className="br"> ]â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”</span>
        </div>

        <div className="owl-row">
          <div className="owl-box">{`'---'\n[0.0]\n/)_(\\`}</div>
          <div className="tagline">
            <span className="tw">VECTOR</span>{" Â· sentinel Â· always watching Â· never afraid"}
          </div>
        </div>

        <div className="section-header">â€” MISSION ]â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”</div>
        <div className="mission-row">
          <span className="arr-identify">â–¶</span>
          <span className="kw-identify">IDENTIFY</span>
          <span className="br">[ </span><span className="muted">F&G</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">market structure</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">prediction mkts</span><span className="br"> ]</span>
        </div>
        <div className="mission-row">
          <span className="arr-enter">â–¶</span>
          <span className="kw-enter">ENTER</span>
          <span className="br">[ </span><span className="muted">top-3 momentum</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">kelly-sized positions</span><span className="br"> ]</span>
        </div>
        <div className="mission-row">
          <span className="arr-protect">â–¶</span>
          <span className="kw-protect">PROTECT</span>
          <span className="br">[ </span><span className="kw-r">hard stop -12%</span><span className="br"> ]â€”â€”[ </span>
          <span className="kw-g">trailing floor +8%</span><span className="br"> ]</span>
        </div>
        <div className="mission-row">
          <span className="arr-capture">â–¶</span>
          <span className="kw-capture">CAPTURE</span>
          <span className="br">[ </span><span className="kw-y">target +25%</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">never fight the trend</span><span className="br"> ]</span>
        </div>

        <div className="event-key-section">
          <div className="ev-hdr">â€” EVENT KEY ]</div>
          <div className="badge-row">
            <span className="badge b-green">â–¶ ENTRY</span>
            <span className="badge b-red">âœ• STOP</span>
            <span className="badge b-purple">âš¡ SHIELD</span>
            <span className="badge b-blue">â—‡ ORACLE</span>
            <span className="badge b-gold">â—† GATE</span>
          </div>
          <div className="badge-row">
            <span className="badge b-green2">âœ“ PROFIT</span>
            <span className="badge b-gray">â†‘ TRAIL</span>
            <span className="badge b-gray">â—‹ RANKER</span>
            <span className="badge b-warn">âš  WARNING</span>
          </div>
        </div>

        <div className="bottom-bar">
          <span>Log: orchestrator.log</span>
          <span><span className="live-dot">â— </span><span className="live-time">LIVE {time}</span></span>
          <span>Ctrl+C to exit Â· streaming...</span>
        </div>

        <div className="about-section">
          <p><span className="em">A.S.T.R.O.</span> is not a signal service. It is a financial cognition engine designed to translate the world's fragmented market data into a unified probability framework for digital assets.</p>
          <p>At its core is a proprietary multi-dimensional oracle architecture that continuously ingests and interprets live global market intelligence across nine independent signal domains:</p>
          <ul>
            <li>Fear &amp; Greed Regimes</li>
            <li>Market Structure Dynamics</li>
            <li>Funding Rate Distortions</li>
            <li>Liquidity Pressure Mapping</li>
            <li>Macro Correlation Networks</li>
            <li>On-Chain Capital Flows</li>
            <li>Derivatives &amp; Options Positioning</li>
            <li>Narrative and Sentiment Velocity</li>
            <li>Congressional Insider Activity &amp; Smart Capital Monitoring</li>
            <li>Prediction Market Intelligence &amp; Collective Foresight Signals</li>
            <li>1-Minute Candle Pattern Recognition &amp; Momentum Detection</li>
          </ul>
          <p>Each layer is processed through an intellectual reaction stack that models how institutional algorithms, market makers, liquidity providers, retail participants, and autonomous trading systems are likely to respond under current conditions.</p>
          <p>Rather than measuring what the market is doing, <span className="em">A.S.T.R.O.</span> measures what the market is likely to do next.</p>
          <p>The engine synthesizes millions of data points into a single <span className="gr">Asset Gate Status</span> â€” a continuously evolving probability score that identifies whether capital conditions favor accumulation, expansion, distribution, or contraction for any supported asset.</p>
          <p>Bitcoin. Ethereum. Solana. Equities. Macro proxies. Any market where behavior leaves a measurable footprint.</p>
          <p>The result is a machine-readable translation layer between raw market complexity and actionable intelligence.</p>
          <p>No charts to interpret.<br />No indicators to configure.<br />No noise.</p>
          <p>One API request every fifteen minutes delivers a complete strategic assessment generated by the <span className="em">A.S.T.R.O. Oracle Engine</span>.</p>
          <p>For traders, funds, quantitative systems, and autonomous agents seeking an informational edge, <span className="em">A.S.T.R.O.</span> functions as a market operating system â€” decoding the collective behavior of global capital in real time.</p>
          <p style={{textAlign: "center", color: "#888"}}>Not a signal.<br />A translation of the market itself.</p>
        </div>

        <div className="dev-section">
          <div className="dev-header">â€” FOR DEVELOPERS ]</div>
          <div className="dev-subtext">Integrate <span>A.S.T.R.O.</span> intelligence directly into your trading system, bot, or algorithm.</div>

          <div className="code-block">
            <div className="code-label"><span className="lang">endpoints</span></div>
            <div><span className="c-key">/oracle/composite</span>   <span className="c-comment">{'  # composite Â· regime Â· top asset Â· btc price'}</span></div>
            <div><span className="c-key">/oracle/signals</span>     <span className="c-comment">{'    # 11 signals Â· momentum Â· sentiment Â· stablecoin supply Â· fed cut prob'}</span></div>
            <div><span className="c-key">/oracle/assets</span>      <span className="c-comment">{'     # per-asset gate Â· ascendancy Â· velocity Â· SMA200 Â· funding score'}</span></div>
            <div><span className="c-key">/oracle/regime</span>      <span className="c-comment">{'     # regime context Â· confluence Â· 4h trend Â· shift'}</span></div>
            <div><span className="c-key">/oracle/risk</span>        <span className="c-comment">{'       # risk mode Â· kelly multiplier Â· max positions'}</span></div>
            <div><span className="c-key">/oracle/prices</span>      <span className="c-comment">{'     # live prices Â· all 10 assets'}</span></div>
            <div><span className="c-key">/oracle/congress</span>    <span className="c-comment">{'    # congressional smart money composite'}</span></div>
            <div><span className="c-key">/oracle/history</span>     <span className="c-comment">{'    # oracle cycle history Â· full signal log'}</span></div>
            <div><span className="c-key">/oracle/gate/:asset</span> <span className="c-comment">{'# complete single-asset decision package'}</span></div>
            <div><span className="c-key">/oracle/basket</span>      <span className="c-comment">{'     # full 10-asset scan Â· one call'}</span></div>
          </div>

          <div className="code-block">
            <div className="code-label"><span className="lang">bash</span></div>
            <span className="c-cmd">pip install</span> <span className="c-pkg">astro-intelligence</span>
          </div>

          <div className="code-block">
            <div className="code-label"><span className="lang">python</span></div>
            <div><span className="c-kw">from</span> <span className="c-pkg">astro_intelligence</span> <span className="c-kw">import</span> <span className="c-cls">ASTRO</span></div>
            <br />
            <div><span className="c-var">client</span> = <span className="c-cls">ASTRO</span>(<span className="c-var">api_key</span>=<span className="c-str">"your-key"</span>)</div>
            <div><span className="c-var">reading</span> = <span className="c-var">client</span>.<span className="c-fn">composite</span>()</div>
            <br />
            <div><span className="c-kw">print</span>(<span className="c-var">reading</span>.<span className="c-key">regime</span>)     <span className="c-comment"># "BEARISH"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">reading</span>.<span className="c-key">composite</span>)  <span className="c-comment"># 36.98</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">client</span>.<span className="c-fn">gate</span>(<span className="c-str">"BTC"</span>)) <span className="c-comment"># "BLOCKED"</span></div>
          </div>

          <div className="code-block">
            <div className="code-label"><span className="lang">python</span> <span style={{color:"#555"}}>// full decision package â€” one call</span></div>
            <div><span className="c-var">gate</span> = <span className="c-var">client</span>.<span className="c-fn">gate</span>(<span className="c-str">"SOL"</span>)</div>
            <br />
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">gate</span>)              <span className="c-comment"># "OPEN" or "BLOCKED"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">strategy</span>)          <span className="c-comment"># "CANDLE_REVERSAL"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">confidence</span>)        <span className="c-comment"># 0.847</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">ascendancy</span>)        <span className="c-comment"># 43.1 â€” prediction market crowd score</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">velocity</span>)          <span className="c-comment"># +9.3 â€” momentum direction</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">candle_pattern</span>)    <span className="c-comment"># "MARUBOZU"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">regime</span>)            <span className="c-comment"># "RECOVERY"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">confluence</span>)        <span className="c-comment"># "BULL"</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">dimension_scores</span>)  <span className="c-comment"># fng Â· breadth Â· vol Â· price_vs_sma ...</span></div>
            <div><span className="c-kw">print</span>(<span className="c-var">gate</span>.<span className="c-key">position</span>)          <span className="c-comment"># current position + live P&L</span></div>
            <br />
            <div><span className="c-comment"># scan the whole basket in one call</span></div>
            <div><span className="c-var">basket</span> = <span className="c-var">client</span>.<span className="c-fn">basket</span>()</div>
            <div><span className="c-var">open_now</span> = <span className="c-var">basket</span>.<span className="c-key">open_assets</span>  <span className="c-comment"># ["BTC","ETH"] â€” actionable right now</span></div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-label">
            <span>$9 / month</span> Â· recurring Â· cancel anytime
          </div>
          <a className="cta-btn" href="https://buy.stripe.com/aFa9ATa4d1tk7DkbgcaAw01">ACQUIRE ACCESS</a>
        </div>

      </div>
    </>
  );
}
