import {createHmac, randomInt, timingSafeEqual} from 'node:crypto';
import {createTrialHandler} from './trial_access.mjs';

const ORIGIN = 'https://astro-event-horizon.vercel.app';
const LIMIT = `local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n`;
const parse = v => typeof v === 'string' ? JSON.parse(v) : v;
export function createSelfServiceTrial({redis, sendVerification, sendTrial, getSecret=()=>process.env.ASTRO_REGISTER_SECRET, clock=()=>Date.now(), enabled=()=>process.env.ASTRO_SELF_SERVICE_TRIALS==='enabled'}) {
  return async (req,res) => {
    res.setHeader('Cache-Control','no-store');
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    if(!enabled())return res.status(503).json({error:'Self-service trials are not yet available'});
    if(req.headers.origin!==ORIGIN)return res.status(403).json({error:'Use the ASTRO trial page'});
    const secret=getSecret();
    if(typeof secret!=='string'||!secret.trim())return res.status(503).json({error:'Signup unavailable'});
    const b=req.body;
    const email=typeof b?.email==='string'?b.email.trim().toLowerCase():'';
    if(!b||!['request','verify'].includes(b.action)||email.length>254||!/^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email))return res.status(400).json({error:'A single standard email address is required'});
    const hash=s=>createHmac('sha256',secret).update(s).digest('hex');
    const identity=hash('email:'+email);
    // Vercel owns this header; use socket fallback only for local tests.
    const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
    const count=(key,seconds)=>redis.eval(LIMIT,[key],[String(seconds)]);
    try {
      if(await count('signup:ip:'+hash(ip)+':'+b.action,3600)>20)return res.status(429).json({error:'Too many attempts; try later'});
      if(b.action==='request') {
        const useCase=typeof b.use_case==='string'?b.use_case.trim():'';
        if(b.consent!==true||useCase.length<10||useCase.length>1500)return res.status(400).json({error:'Accept the terms and describe your use case'});
        if(await count('signup:email:'+identity,3600)>3)return res.status(429).json({error:'Too many requests; try later'});
        if(await count('signup:global',3600)>100)return res.status(429).json({error:'Signup capacity reached; try later'});
        if(await count('signup:daily',86400)>100)return res.status(429).json({error:'Daily trial capacity reached; try tomorrow'});
        // No token in a URL, no plaintext code persisted, ten-minute proof lifetime.
        const code=String(randomInt(0,100000000)).padStart(8,'0');
        const record={proof:hash(identity+':'+code),use_case:useCase,expires:clock()+600000};
        await redis.set('signup:proof:'+identity,JSON.stringify(record),{ex:600});
        await sendVerification({email,code});
        return res.json({message:'Check your email. Enter the latest code here within ten minutes.'});
      }
      if(typeof b.code!=='string'||!/^\d{8}$/.test(b.code))return res.status(400).json({error:'Invalid or expired verification code'});
      if(await count('signup:attempts:'+identity,600)>5)return res.status(429).json({error:'Too many verification attempts; wait ten minutes'});
      const record=parse(await redis.get('signup:proof:'+identity));
      const proof=hash(identity+':'+b.code);
      if(!record||record.expires<=clock()||typeof record.proof!=='string'||record.proof.length!==proof.length||!timingSafeEqual(Buffer.from(record.proof),Buffer.from(proof)))return res.status(400).json({error:'Invalid or expired verification code'});
      // Reuse the existing email identity index: invited and self-service trials cannot stack.
      // Trial issuance is idempotent; retaining short-lived proof permits safe SMTP retries.
      const issue=createTrialHandler({redis,sendEmail:sendTrial,getSecret,clock});
      return await issue({method:'POST',headers:{'x-astro-secret':secret},body:{action:'issue',reviewed:true,email,use_case:record.use_case}},res);
    } catch {return res.status(503).json({error:'Signup incomplete; retry later'});}
  };
}
