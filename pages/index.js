import Head from "next/head";
import DataAttribution from "../components/DataAttribution";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
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
            <span className="br">â€”[ </span><span className="g">PUBLIC::API</span>
            <span className="br"> ]â€”[ </span><span className="g">PAPER::ONLY</span>
            <span className="br"> ]â€”[ </span><span className="g">MCP::STDIO</span>
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
          <span className="br">[ </span><span className="muted">asset assessments</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">decision support</span><span className="br"> ]</span>
        </div>
        <div className="mission-row">
          <span className="arr-protect">â–¶</span>
          <span className="kw-protect">PROTECT</span>
          <span className="br">[ </span><span className="kw-r">source timestamps</span><span className="br"> ]â€”â€”[ </span>
          <span className="kw-g">missing-data flags</span><span className="br"> ]</span>
        </div>
        <div className="mission-row">
          <span className="arr-capture">â–¶</span>
          <span className="kw-capture">CAPTURE</span>
          <span className="br">[ </span><span className="kw-y">component explanations</span><span className="br"> ]â€”â€”[ </span>
          <span className="muted">paper research, not promised returns</span><span className="br"> ]</span>
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
          <span>ASTRO intelligence access</span>
          <span><span className="live-dot">â— </span><span className="live-time">LOCAL {time}</span></span>
          <span>Source freshness is reported per response Â· streaming...</span>
        </div>

        <div className="about-section">
          <p><span className="em">A.S.T.R.O.</span> translates prediction-market contracts, congressional disclosures, and market data into explained crypto-market assessments.</p>
          <p>Nine weighted components cover fear and greed, market structure, funding, liquidity, macro, on-chain activity, options, narrative, and congressional activity. Prediction-market interpretation and candle evidence provide additional context.</p>
          <p>Explore component contributions, event deadlines, asset assessments, and source-quality indicators. Scores and strategy confidence are heuristics, not calibrated probabilities of a profitable trade.</p>
          <p>Supported assets: BTC, ETH, SOL, ADA, DOGE, ARB, OP, LINK, POL, and DOT.</p>
          <p>Use the signal, context, and basket resources in your dashboard, market brief, bot, or AI workflow. These endpoints provide decision support; they do not execute customer trades.</p>
          <p>Module 8 is evaluating models in a forward shadow trial. Learned weights are not automatically promoted, and an adaptive trading advantage has not yet been demonstrated.</p>
        </div>

        <div className="dev-section">
          <div className="dev-header">FOR DEVELOPERS</div>
          <div className="dev-subtext">Connect <span>A.S.T.R.O.</span> through public HTTP, local MCP, or n8n.</div>
          <div className="code-block">
            <div className="code-label"><span className="lang">credential-free HTTPS endpoints</span></div>
            <div>/api/public/signal — composite, regime and components</div>
            <div>/api/public/context — market evidence and explanations</div>
            <div>/api/public/basket — ten assets and decision-support details</div>
            <p>No signup, API key, trial activation, or payment required for these public resources. Poll conservatively and inspect source timestamps and stale/missing flags; a recent response does not guarantee every input is fresh.</p>
          </div>
          <p><a href="/mcp" style={{color:'#f5c518'}}>MCP setup and source download</a> — Python 3.10+, local stdio transport.</p>
          <p><a href="/explore/" style={{color:'#f5c518'}}>Open Signal Explorer</a></p>
          <p><a href="/explore/astro-n8n-market-brief.json" style={{color:'#f5c518'}}>Download the n8n market-brief workflow</a> · <a href="/explore/astro-n8n-setup.txt" style={{color:'#f5c518'}}>Setup instructions</a></p>
          <p>Existing authenticated accounts remain separate. The optional consumer bot is paper-only; purchasing it is not required for public intelligence access.</p>
        </div>

        <div className="cta-section">
          <div className="cta-label"><span>Explore the evidence. Connect your workflow.</span></div>
          <a className="cta-btn" href="/explore/">EXPLORE ASTRO</a>
        </div>

        <DataAttribution />
        <a href="/" aria-label="Ran by JARVIS" style={{position:'fixed',bottom:12,right:12,display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:24,background:'rgba(15,25,35,0.75)',backdropFilter:'blur(10px)',color:'#60d5ff',opacity:0.7,textDecoration:'none',fontSize:11,zIndex:10}} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
          <img src="/jarvis-emblem.jpg" alt="" width="24" height="24" style={{borderRadius:'50%'}} />RAN BY JARVIS
        </a>

      </div>
    </>
  );
}
