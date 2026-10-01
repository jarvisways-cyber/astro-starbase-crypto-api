import test from 'node:test';
import assert from 'node:assert/strict';
import {createTrialHandler,trialEmail} from '../lib/trial_access.mjs';
import {exportEntitlement} from '../lib/founding_offer.mjs';
const start=Date.parse('2026-10-01T00:00:00Z');
function setup(){
 const data=new Map(),keys=new Set(),mails=[];let now=start;
 const redis={async get(k){return data.get(k)??null;},async set(k,v,o){if(o?.nx&&data.has(k))return null;data.set(k,v);return 'OK';},async sadd(k,v){keys.add(v);}};
 const deps={redis,sendEmail:async r=>mails.push(r),getSecret:()=> 'fixture-secret',clock:()=>now};
 const invoke=async(body={},headers={'x-astro-secret':'fixture-secret'},method='POST')=>{
  const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(b){this.body=b;return this;}};
  await createTrialHandler(deps)({body,headers,method},res);return res;
 };
 const issue={action:'issue',reviewed:true,email:'tester@example.invalid',use_case:'Building a crypto screener'};
 return {data,keys,mails,deps,invoke,issue,advance:n=>now=n};
}
test('unauthorized, unreviewed and malformed requests cannot provision',async()=>{
 const f=setup();assert.equal((await f.invoke(f.issue,{})).code,401);
 assert.equal((await f.invoke({...f.issue,reviewed:false})).code,400);
 assert.equal((await f.invoke({...f.issue,email:'bad'})).code,400);
 assert.equal((await f.invoke({...f.issue,use_case:''})).code,400);
 assert.equal(f.data.size,0);assert.equal(f.mails.length,0);
});
test('authenticated dry run does not even touch the registry or email',async()=>{
 const f=setup();f.deps.redis.get=async()=>{throw Error('no access expected');};
 const r=await f.invoke({...f.issue,dry_run:true});assert.equal(r.code,200);
 assert.equal(r.body.provisioned,false);assert.equal(f.data.size,0);assert.equal(f.mails.length,0);
});
test('trial creates one private key,30days, no billing, no key in response',async()=>{
 const f=setup(),r=await f.invoke(f.issue);assert.equal(r.code,200);
 assert.equal(f.keys.size,1);assert.equal(f.mails.length,1);
 assert.equal(Date.parse(r.body.expires_at)-Date.parse(r.body.issued_at),30*86400000);
 const record=f.mails[0],meta=JSON.parse(f.data.get('key:'+record.key));
 assert.equal(meta.tier,'starter');assert.equal(meta.entitlement.kind,'invited_trial');
 assert.equal(exportEntitlement(meta,Date.parse(r.body.expires_at)),null);
 assert.ok(!JSON.stringify(r.body).includes(record.key));assert.equal(r.headers['Cache-Control'],'no-store');
 assert.match(trialEmail(record).html,/No card, payment or automatic subscription/);
});
test('same email retry and concurrent calls do not mint extra keys or extend expiry',async()=>{
 const f=setup();await Promise.all([f.invoke(f.issue),f.invoke(f.issue)]);assert.equal(f.keys.size,1);
 const first=f.mails[0];f.advance(start+86400000);
 const r=await f.invoke({...f.issue,email:'TESTER@example.invalid'});
 assert.equal(r.body.expires_at,first.expires_at);assert.equal(f.keys.size,1);
});
test('failed email can retry with same key and original deadline',async()=>{
 const f=setup();f.deps.sendEmail=async()=>{throw Error('SMTP fixture failure');};
 assert.equal((await f.invoke(f.issue)).code,503);const key=[...f.keys][0];
 f.advance(start+60000);f.deps.sendEmail=async r=>f.mails.push(r);
 assert.equal((await f.invoke(f.issue)).code,200);assert.equal(f.mails[0].key,key);
 assert.equal(Date.parse(f.mails[0].expires_at),start+30*86400000);
});
test('status reports delivered email; revoke cannot be undone by issue retry',async()=>{
 const f=setup(),r=await f.invoke(f.issue),id=r.body.trial_id;
 assert.equal((await f.invoke({action:'status',trial_id:id})).body.email_delivery,'sent');
 assert.equal((await f.invoke({action:'revoke',trial_id:id})).body.state,'revoked');
 assert.equal((await f.invoke(f.issue)).code,409);
 assert.equal(JSON.parse(f.data.get('key:'+f.mails[0].key)).active,false);
});
test('ended trial cannot automatically renew through another request',async()=>{
 const f=setup();await f.invoke(f.issue);f.advance(start+30*86400000);
 const r=await f.invoke(f.issue);assert.equal(r.code,409);assert.equal(r.body.state,'expired');assert.equal(f.keys.size,1);
});
test('a revoke between record creation and key creation remains effective',async()=>{
 const f=setup(),original=f.deps.redis.set;
 f.deps.redis.set=async(k,v,o)=>{
  if(k.startsWith('key:')) {
   const trialPath=[...f.data.keys()].find(x=>x.startsWith('trial:'));
   const record=JSON.parse(f.data.get(trialPath));record.revoked=true;f.data.set(trialPath,JSON.stringify(record));
  }
  return original(k,v,o);
 };
 const r=await f.invoke(f.issue);assert.equal(r.code,409);assert.equal(f.mails.length,0);
 const path=[...f.data.keys()].find(x=>x.startsWith('key:'));assert.equal(JSON.parse(f.data.get(path)).active,false);
});
