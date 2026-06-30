import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [state, setState] = useState("loading");
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    if (!session_id) return;
    const attempt = async (tries = 0) => {
      try {
        const res = await fetch(`/api/get-key?session_id=${session_id}`);
        const data = await res.json();
        if (data.key) { setApiKey(data.key); setState("done"); }
        else if (tries < 5) { setTimeout(() => attempt(tries + 1), 4000); }
        else setState("error");
      } catch { if (tries < 5) setTimeout(() => attempt(tries + 1), 4000); else setState("error"); }
    };
    attempt();
  }, [session_id]);

  const styles = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #050506; color: #a0aec0; font-family: 'Courier New', monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .box { background: #0a0a0c; border: 1px solid #008877; padding: 40px; max-width: 600px; width: 95%; text-transform: uppercase; }
    .title { color: #00ffcc; font-size: 18px; letter-spacing: 3px; margin-bottom: 30px; }
    .key-box { border: 1px solid #00ffcc; padding: 20px; margin: 20px 0; font-size: 14px; color: #e2e8f0; letter-spacing: 2px; word-break: break-all; }
    .label { font-size: 10px; color: #4a5568; margin-bottom: 8px; }
    .note { font-size: 11px; color: #4a5568; margin-top: 20px; line-height: 1.8; }
    .warn { color: #ffcc00; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="box">
        <div className="title">[ ASTRO // ACCESS GRANTED ]</div>
        {state === "loading" && <div className="warn">&#9656; Retrieving your key...</div>}
        {state === "error" && <div style={{color:"#ff3333"}}>&#9656; Key lookup failed. Email astro@astro-event-horizon.vercel.app with your payment receipt.</div>}
        {state === "done" && <>
          <div className="label">YOUR API KEY</div>
          <div className="key-box">{apiKey}</div>
          <div className="note">
            <div>&#9656; Save this key — it will not be shown again.</div>
            <div>&#9656; Endpoint: <span style={{color:"#00ffcc"}}>https://astro-event-horizon.vercel.app/api/signal?api_key=YOUR_KEY</span></div>
            <div>&#9656; Rate limit: 1 request per 15 minutes.</div>
            <div>&#9656; Support: astro@astro-event-horizon.vercel.app</div>
          </div>
        </>}
      </div>
    </>
  );
}
