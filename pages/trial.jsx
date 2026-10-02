import Head from 'next/head';
import {useState} from 'react';
export default function Trial(){
 const [email,setEmail]=useState(''),[useCase,setUseCase]=useState(''),[code,setCode]=useState(''),[consent,setConsent]=useState(false),[stage,setStage]=useState('request'),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setMessage('');try{
  const r=await fetch('/api/trial',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:stage,email,use_case:useCase,consent,code})});
  const b=await r.json();if(!r.ok)throw Error(b.error||'Please retry later.');
  if(stage==='request'){setStage('verify');setMessage(b.message);}else{setStage('done');setCode('');setMessage(`Your trial is active until ${b.expires_at}. Your private key has been emailed to you. Allow up to five minutes for access synchronization.`);}
 }catch(err){setMessage(err.message||'Please retry later.');}finally{setBusy(false);}}
 return <><Head><title>ASTRO — One Month API Trial</title><meta name="referrer" content="no-referrer"/></Head><main>
 <a href="/">← ASTRO</a><h1>Build with ASTRO.</h1><p>One month of live crypto intelligence. No card, purchase, likes, or follows required.</p>
 <p>Explore signal, context and the full asset basket for 30 days. No automatic renewal. Already subscribed or a Founding Supporter? Use your existing key.</p>
 {stage!=='done'&&<form onSubmit={submit}><label>Email<input type="email" required maxLength={254} value={email} disabled={stage==='verify'} onChange={e=>setEmail(e.target.value)}/></label>
 {stage==='request'?<><label>What would you build?<textarea required minLength={10} maxLength={1500} value={useCase} onChange={e=>setUseCase(e.target.value)}/></label><label><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/> I accept the <a href="/terms">terms</a> and <a href="/privacy">privacy policy</a>, and request verification and API-access emails. This is not a marketing subscription.</label></>:<label>Email verification code<input type="password" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" required maxLength={8} value={code} onChange={e=>setCode(e.target.value)}/></label>}
 <button disabled={busy}>{busy?'Working…':stage==='request'?'Send verification email':'Activate my 30-day trial'}</button></form>}
 <p role="status">{message}</p>{stage==='done'&&<p><a href="/mcp">Set up the ASTRO MCP connector →</a></p>}{stage==='verify'&&<button disabled={busy} onClick={()=>{setStage('request');setCode('');setMessage('You may request a new code or correct your email. Request limits still apply.');}}>Change email or request a new code</button>}<p>Keep your verification code and API key private. Do not paste them into an AI conversation.</p>
 <p>One trial per email address, starting at verified activation. Normal API limits apply: one request per resource every 15 minutes. Access changes, including expiry, can take up to five minutes.</p>
 <a className="badge" href="/"><img src="/jarvis-emblem.jpg" alt="" width="24" height="24"/> RAN BY JARVIS</a></main><style jsx>{`main{max-width:680px;margin:48px auto;padding:24px;font:17px/1.6 system-ui;color:#e5edf5;background:#101827;border-radius:16px}a{color:#71e3f5}label{display:block;margin:18px 0}input:not([type=checkbox]),textarea{display:block;width:95%;padding:12px;font:inherit}button{padding:12px 20px;font:inherit;cursor:pointer}.badge{position:fixed;right:12px;bottom:12px;padding:8px 14px;background:#122638cc;backdrop-filter:blur(10px);border-radius:24px;opacity:.7;font-size:11px}.badge:hover{opacity:1}`}</style></>;
}
