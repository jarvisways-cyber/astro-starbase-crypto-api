import {createHmac, randomBytes} from 'node:crypto';
import {isIP} from 'node:net';
const URL='https://astro-event-horizon.vercel.app/trial';
const parse=v=>typeof v==='string'?JSON.parse(v):v;
// Atomic creation + publication: retrying cannot extend or overwrite an entitlement.
export const ACTIVATE=`
local prior=redis.call('GET',KEYS[1]); if prior then return prior end
local ip=tonumber(redis.call('GET',KEYS[2]) or '0')
local day=tonumber(redis.call('GET',KEYS[3]) or '0')
local total=tonumber(redis.call('GET',KEYS[4]) or '0')
if ip>=3 or day>=25 or total>=250 then return 'capacity' end
redis.call('INCR',KEYS[2]); redis.call('EXPIRE',KEYS[2],2592000)
redis.call('INCR',KEYS[3]); redis.call('EXPIRE',KEYS[3],86400)
redis.call('INCR',KEYS[4])
redis.call('SET',KEYS[1],ARGV[1])
redis.call('SET',KEYS[5],ARGV[2],'NX')
redis.call('SADD',KEYS[6],ARGV[3])
return ARGV[1]`;
const RATE=`local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],3600) end; return n`;
export function createAnonymousTrial({redis,clock=()=>Date.now(),getSecret=()=>process.env.ASTRO_REGISTER_SECRET,enabled=()=>process.env.ASTRO_ANONYMOUS_TRIALS==='enabled'}) {
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!enabled())return res.status(503).json({status:'signup_required',signup_url:URL});
  const secret=getSecret();
  if(typeof secret!=='string'||!secret.trim())return res.status(503).json({status:'unavailable'});
  const token=req.headers['x-astro-installation'];
  if(typeof token!=='string'||!/^astro-install-[a-f0-9]{64}$/.test(token)||req.body?.terms_version!=='2026-10-02')return res.status(400).json({error:'Valid installation and terms version required'});
  const hash=s=>createHmac('sha256',secret).update(s).digest('hex');
  const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'').split(',')[0].trim();
  if(!isIP(ip))return res.status(503).json({status:'unavailable'});
  const path='anonymous:install:'+hash(token);
  try {
   if(await redis.eval(RATE,['anonymous:requests:'+hash(ip)],[])>60)return res.status(429).json({status:'retry_later',signup_url:URL});
   let record=parse(await redis.get(path));
   if(!record){
    const now=clock(), key='astro-anon-'+randomBytes(24).toString('hex');
    const created=new Date(now).toISOString(), expires=new Date(now+30*86400000).toISOString();
    const proposed={key,issued_at:created,expires_at:expires};
    const meta={tier:'starter',active:true,livemode:true,created,entitlement:{kind:'anonymous_trial',access_until:expires}};
    const value=await redis.eval(ACTIVATE,[path,'anonymous:network:'+hash(ip),'anonymous:daily','anonymous:pilot-total','key:'+key,'astro:keys'],[JSON.stringify(proposed),JSON.stringify(meta),key]);
    if(value==='capacity')return res.status(429).json({status:'signup_required',signup_url:URL,message:'Anonymous pilot capacity reached; verified-email trials remain available.'});
    record=parse(value);
   }
   const meta=parse(await redis.get('key:'+record.key));
   if(!meta||meta.active!==true)return res.status(403).json({status:'access_ended',signup_url:URL});
   if(Date.parse(record.expires_at)<=clock())return res.status(403).json({status:'trial_expired',expires_at:record.expires_at,signup_url:URL,message:'Your 30-day trial has ended. Sign up to continue; no automatic charge.'});
   return res.json({status:'active',api_key:record.key,issued_at:record.issued_at,expires_at:record.expires_at,signup_url:URL,activation_delay_seconds:60});
  }catch{return res.status(503).json({status:'unavailable',message:'Retry later; existing trial deadlines are not reset.'});}
 };
}
