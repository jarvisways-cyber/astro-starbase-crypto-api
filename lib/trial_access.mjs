import {createHash, randomBytes, randomUUID, timingSafeEqual} from 'node:crypto';
const DAYS30 = 30 * 24 * 60 * 60 * 1000;
const object = raw => typeof raw === 'string' ? JSON.parse(raw) : raw;
function authorized(req, secret) {
  const supplied=req.headers['x-astro-secret'];
  return typeof supplied==='string' && supplied.length>0 && Buffer.byteLength(supplied)===Buffer.byteLength(secret) && timingSafeEqual(Buffer.from(supplied),Buffer.from(secret));
}
function publicReceipt(record, now) {
  return {trial_id:record.id, issued_at:record.issued_at, expires_at:record.expires_at,
    state:record.revoked?'revoked':Date.parse(record.expires_at)<=now?'expired':'active',
    email_delivery:record.sent?'sent':'pending', duration_days:30};
}
export function trialEmail(record) {
  if (!/^astro-trial-[a-f0-9]{48}$/.test(record.key)) throw Error('Invalid key');
  return {to:record.email,subject:'Your 30-day ASTRO API trial',html:
    `<div style="font-family:monospace"><h1>Welcome to ASTRO</h1><p>Your reviewed trial request has been approved.</p><p>Your private API key:</p><pre>${record.key}</pre><p>Full API-plan access expires at ${record.expires_at} (UTC). No card, payment or automatic subscription is created. Normal limits apply: one request per resource per 15 minutes. Key synchronization normally takes about one minute.</p><p><a href="https://github.com/jarvisways-cyber/astro-starbase-crypto-api">Documentation and Python examples</a></p><p>Tell us what you built, which fields helped, and what was missing. Reply privately to this email; do not post your key publicly.</p></div>`};
}
export function createTrialHandler({redis,sendEmail,getSecret=()=>process.env.ASTRO_REGISTER_SECRET,clock=()=>Date.now()}) {
  return async function handler(req,res) {
    res.setHeader('Cache-Control','no-store');
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    const secret=getSecret();
    if(typeof secret!=='string'||!secret.trim())return res.status(503).json({error:'Administration unavailable'});
    if(!authorized(req,secret))return res.status(401).json({error:'Unauthorized'});
    const b=req.body;
    if(!b || typeof b!=='object' || Array.isArray(b))return res.status(400).json({error:'Invalid request'});
    const now=clock();
    try {
      if(['status','revoke'].includes(b.action)) {
        if(typeof b.trial_id!=='string'|| !/^[a-f0-9-]{36}$/.test(b.trial_id))return res.status(400).json({error:'Invalid trial identifier'});
        const record=object(await redis.get('trial:'+b.trial_id));
        if(!record)return res.status(404).json({error:'Trial not found'});
        if(b.action==='revoke') {
          record.revoked=true;
          await redis.set('trial:'+record.id,JSON.stringify(record));
          const meta=object(await redis.get('key:'+record.key));
          if(meta){meta.active=false;await redis.set('key:'+record.key,JSON.stringify(meta));}
        }
        return res.json(publicReceipt({...record,sent:!!await redis.get('trial_mail:'+record.id)},now));
      }
      if(b.action!=='issue'||b.reviewed!==true)return res.status(400).json({error:'Reviewed invitation required'});
      const email=typeof b.email==='string'?b.email.trim().toLowerCase():'';
      const useCase=typeof b.use_case==='string'?b.use_case.trim():'';
      if(email.length>254||!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)||useCase.length<10||useCase.length>1500)
        return res.status(400).json({error:'Valid email and concrete use case required'});
      // Safe connectivity/schema probe: validates a request but cannot create keys or mail.
      if(b.dry_run===true)return res.json({valid:true,duration_days:30,provisioned:false,email_sent:false});
      const emailIndex='trial_email:'+createHash('sha256').update(email).digest('hex');
      let id=await redis.get(emailIndex);
      if(!id) {
        await redis.set(emailIndex,randomUUID(),{nx:true});
        id=await redis.get(emailIndex);
      }
      const path='trial:'+id;
      let record=object(await redis.get(path));
      if(!record) {
        await redis.set(path,JSON.stringify({id,email,use_case:useCase,key:'astro-trial-'+randomBytes(24).toString('hex'),
          issued_at:new Date(now).toISOString(),expires_at:new Date(now+DAYS30).toISOString(),sent:false,revoked:false}),{nx:true});
        record=object(await redis.get(path));
      }
      if(!record||record.email!==email)throw Error('Trial identity mismatch');
      if(record.revoked||Date.parse(record.expires_at)<=now)return res.status(409).json({error:'Prior trial ended; automatic renewal is disabled',...publicReceipt(record,now)});
      await redis.set('key:'+record.key,JSON.stringify({tier:'starter',email,active:true,livemode:true,created:record.issued_at,
        entitlement:{kind:'invited_trial',trial_id:id,access_until:record.expires_at}}),{nx:true});
      const keyMeta=object(await redis.get('key:'+record.key));
      const current=object(await redis.get(path));
      if(current?.revoked) {
        if(keyMeta){keyMeta.active=false;await redis.set('key:'+record.key,JSON.stringify(keyMeta));}
        return res.status(409).json({error:'Access has been revoked'});
      }
      if(keyMeta?.active!==true)return res.status(409).json({error:'Access has been revoked'});
      await redis.sadd('astro:keys',record.key);
      if(!await redis.get('trial_mail:'+id)) {
        await sendEmail(record);
        await redis.set('trial_mail:'+id,'sent');
      }
      // Never overwrite the trial after SMTP: a concurrent revoke must remain revoked.
      const latest=object(await redis.get(path));
      return res.json(publicReceipt({...latest,sent:true},now));
    } catch {
      return res.status(503).json({error:'Trial operation incomplete; retry the same request'});
    }
  };
}
