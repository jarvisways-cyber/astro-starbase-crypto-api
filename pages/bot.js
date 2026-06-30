import Head from "next/head";
import { useEffect, useState } from "react";

export default function Bot() {
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
        <title>A.S.T.R.O. // TRADE BOT TERMINAL</title>
        <meta name="description" content="A.S.T.R.O. — the autonomous trade bot, downloadable, yours forever." />
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
        .br { color: #444; }
        .nav-row {
          border: 1px solid #333;
          border-top: none;
          padding: 5px 10px;
          font-size: 15px;
          color: #666;
          text-align: center;
        }
        .nav-row a { color: #f5c518; text-decoration: none; }
        .nav-row a:hover { color: #fff; }
        .main-frame {
          border: 1px solid #333;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .owl-box {
          color: #f5c518;
          line-height: 1.05;
          white-space: pre;
          font-size: 18px;
          text-align: center;
          text-shadow: 0 0 6px #f5c51866;
        }
        .astro-logo {
          font-family: "Press Start 2P", monospace;
          font-size: clamp(34px, 7vw, 64px);
          color: #f5c518;
          line-height: 1.2;
          letter-spacing: 2px;
        }
        .sub-logo {
          font-family: "Share Tech Mono", monospace;
          font-size: 16px;
          letter-spacing: 5px;
          color: #00ff41;
        }
        .tagline { color: #999; letter-spacing: 1px; font-size: 17px; margin-top: 4px; }
        .tagline .tw { color: #c8c8c8; }
        .cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: #f5c518;
          margin-left: 4px;
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .section-header {
          border: 1px solid #333;
          border-top: none;
          padding: 3px 10px;
          font-size: 17px;
          color: #666;
          text-align: center;
        }
        .ps-line {
          border: 1px solid #333;
          border-top: none;
          padding: 4px 10px;
          font-size: 14px;
          color: #00ff41;
          text-align: left;
        }
        .ps-line .path { color: #c8c8c8; }
        .body-section {
          border: 1px solid #333;
          border-top: none;
          padding: 14px 16px;
          font-size: 16px;
          line-height: 1.7;
          color: #bbb;
          text-align: left;
        }
        .body-section .em { color: #f5c518; }
        .body-section .gr { color: #00ff41; }
        .code-block {
          background: #0a0a0a;
          border: 1px solid #333;
          border-top: none;
          padding: 14px 16px;
          font-size: 14px;
          text-align: left;
          white-space: pre;
          overflow-x: auto;
        }
        .pos { color: #00ff41; }
        .neg { color: #ff4444; }
        .label-strong { color: #f5c518; }
        .sample-note {
          border: 1px solid #333;
          border-top: none;
          padding: 4px 10px;
          font-size: 13px;
          color: #666;
          text-align: center;
        }
        .dial-row {
          display: flex;
          gap: 3px;
          padding: 10px 16px 4px;
          border: 1px solid #333;
          border-top: none;
        }
        .dial-seg { flex: 1; height: 7px; }
        .dial-1 { background: #00ff41; }
        .dial-2 { background: #f5c518; }
        .dial-3 { background: #ff4444; }
        .dial-labels {
          display: flex;
          justify-content: space-between;
          border: 1px solid #333;
          border-top: none;
          padding: 4px 16px 10px;
          font-size: 13px;
          color: #666;
        }
        .bullet-list {
          border: 1px solid #333;
          border-top: none;
          padding: 14px 20px;
          text-align: left;
          font-size: 16px;
          line-height: 2;
          color: #bbb;
        }
        .bullet-list .arrow { color: #00ff41; margin-right: 8px; }
        .cta-section {
          margin-top: 14px;
          border: 1px solid #554400;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .cta-label { color: #888; font-size: 17px; text-align: center; }
        .cta-label span { color: #f5c518; }
        .cta-btn {
          font-family: "Press Start 2P", monospace;
          font-size: 13px;
          background: #f5c518;
          color: #000;
          border: none;
          padding: 14px 26px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 1px;
          box-shadow: 0 0 14px #f5c51844;
        }
        .cta-btn:hover { background: #fff; }
        .bottom-bar {
          border: 1px solid #333;
          border-top: none;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-size: 15px;
          color: #666;
        }
        .live-dot { color: #00ff41; }
        .live-time { color: #00ff41; }
      `}</style>

      <div className="terminal">

        <div className="top-bar">
          <span>
            <span className="br">—[ </span><span className="g">SYS::DOWNLOADABLE</span>
            <span className="br"> ]—[ </span><span className="g">ENGINE::AUTONOMOUS</span>
            <span className="br"> ]—[ </span><span className="g">OWNERSHIP::PERMANENT</span>
            <span className="br"> ]—————————————————————</span>
          </span>
        </div>

        <div className="nav-row">
          <a href="/">← BACK TO ORACLE ACCESS TERMINAL</a>
        </div>

        <div className="main-frame">
          <div className="owl-box">{`.___.\n[o.o]\n/)_(\\\n‾‾‾‾‾`}</div>
          <div className="astro-logo">A.S.T.R.O.</div>
          <div className="sub-logo">// THE TRADE BOT //</div>
          <div className="tagline">
            <span className="tw">VECTOR</span>{" · sentinel · always watching · never afraid"}
            <span className="cursor"></span>
          </div>
        </div>

        <div className="ps-line">
          <span className="path">PS C:\ASTRO&gt;</span> Get-LiveStatus
        </div>
        <div className="code-block">
          {"══[ ASTRO LIVE ══ 14:22:07 ══════════════════════════════╡\n"}
          {"│ COMPOSITE 61.4 "}<span className="pos">▲</span>{" regime=CONFLUENCE_BULL  F&G=58  BTC=$71,220\n"}
          {"│ POSITIONS open=2  closed=94  P&L="}<span className="pos">+4.12</span>{"  win=58%\n"}
          {"│ PERFORMANCE equity=$1,247  drawdown="}<span className="neg">-3.2%</span>{"  sharpe=1.18\n"}
          {"│ DECISIONS  ETH:SQUEEZE_PLAY  SOL:CANDLE_MOMENTUM\n"}
          {"│ STRATEGIES squeeze_play:61%  candle_momentum:54%  mean_reversion:38%\n"}
          {"│  last exit  SOL "}<span className="pos">+6.40%</span>{" via squeeze play\n"}
          {"╞══════════════════════════════════════════════════════╡"}
        </div>
        <div className="sample-note">sample output · illustrative, not live performance data</div>

        <div className="ps-line">
          <span className="path">PS C:\ASTRO&gt;</span> cat README_ENGINE.md
        </div>
        <div className="section-header">— WHAT YOU'RE RUNNING ]—————————————————————————————————————</div>
        <div className="body-section">
          <p>The full autonomous engine — <span className="em">Director</span>, <span className="em">Vanguard</span>, <span className="em">Shield</span>, <span className="em">Arbiter</span> — running locally on your machine, wired directly into the same Oracle signal feed that powers the API.</p>
          <p style={{ marginTop: "10px" }}>It doesn't watch charts. It reads regime, momentum, funding distortion, liquidity pressure, and eight other signal domains, then enters, sizes, and protects positions on its own.</p>
        </div>

        <div className="section-header">— DIAL YOUR AGGRESSION ]————————————————————————————————————</div>
        <div className="dial-row">
          <div className="dial-seg dial-1"></div>
          <div className="dial-seg dial-1"></div>
          <div className="dial-seg dial-1"></div>
          <div className="dial-seg dial-2"></div>
          <div className="dial-seg dial-2"></div>
          <div className="dial-seg dial-2"></div>
          <div className="dial-seg dial-3"></div>
          <div className="dial-seg dial-3"></div>
          <div className="dial-seg dial-3"></div>
          <div className="dial-seg dial-3"></div>
        </div>
        <div className="dial-labels">
          <span>1 · DEFENSIVE</span>
          <span>10 · FULL CONVICTION</span>
        </div>
        <div className="body-section">
          <p>Every time you launch <span className="em">A.S.T.R.O.</span>, you choose: <span className="gr">1–10</span>.</p>
          <p style={{ marginTop: "10px" }}>Not a one-time setup. Not locked at signup. Every session, you decide how hard your engine should lean into the market that day — from defensive capital preservation at 1, to full conviction sizing at 10. Same signal. Same Oracle. Your call, every time you boot it up.</p>
        </div>

        <div className="section-header">— WHAT'S INCLUDED ]—————————————————————————————————————————</div>
        <div className="bullet-list">
          <div><span className="arrow">▶</span>Full trading engine — one-time purchase, no recurring license</div>
          <div><span className="arrow">▶</span>Local installer, no terminal knowledge required</div>
          <div><span className="arrow">▶</span>3 months A.S.T.R.O. Oracle API access, free</div>
          <div><span className="arrow">▶</span>1–10 aggression dial, set per session</div>
          <div><span className="arrow">▶</span>Runs on your machine, your keys, your custody</div>
        </div>

        <div className="section-header">— AFTER 3 MONTHS ]——————————————————————————————————————————</div>
        <div className="body-section">
          <p>API access continues at $9/month, cancel anytime. Your bot keeps running regardless — the engine is yours permanently.</p>
        </div>

        <div className="ps-line">
          <span className="path">PS C:\ASTRO&gt;</span> .\acquire.ps1 -price 365 -mode forever
        </div>

        <div className="cta-section">
          <div className="cta-label">
            <span>$365</span> · one time · yours forever
          </div>
          <a className="cta-btn" href="https://buy.stripe.com/28E7sLekt8VM5vc2JGaAw02">ACQUIRE ASTRO</a>
        </div>

        <div className="bottom-bar">
          <span>Log: orchestrator.log</span>
          <span><span className="live-dot">● </span><span className="live-time">LIVE {time}</span></span>
          <span>Ctrl+C to exit · streaming...</span>
        </div>

      </div>
    </>
  );
}
