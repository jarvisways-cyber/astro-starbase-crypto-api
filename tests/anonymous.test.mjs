import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnonymousTrial,ACTIVATE} from '../lib/anonymous_trial.mjs';
import {exportEntitlement} from '../lib/founding_offer.mjs';
function fixture(){
 const data=new Map(),keys=new Set();let now=Date.parse('2026-10-02T20:00:00Z');
 const redis={get:async k=>data.get(k),eval:async(s,k,a)=>{
  if(s!==ACTIVATE){let n=(data.get(k[0])||0)+1;data.set(k[0],n);return n;}
  if(data.has(k[0]))return data.get(k[0]);
  if((data.get(k[1])||0)>=3||(data.get(k[2])||0)>=25||(data.get(k[3])||0)>=250)return 'capacity';
  for(const name of k.slice(1,4))data.set(name,(data.get(name)||0)+1);
  data.set(k[0],a[0]);if(!data.has(k[4]))data.set(k[4],a[1]);keys.add(a[2]);return a[0];
 }};
 const deps={redis,clock:()=>now,getSecret:()=> 'synthetic-fixture-secret',enabled:()=>true};
 async function call(token='astro-install-'+'a'.repeat(64),ip='127.0.0.1'){
  const res={code:200,setHeader(){},status(c){this.code=c;return this;},json(b){this.body=b;return this;}};
  await createAnonymousTrial(deps)({method:'POST',headers:{'x-astro-installation':token},body:{terms_version:'2026-10-02'},socket:{remoteAddress:ip}},res);return res;
 }
 return {data,keys,deps,call,advance:n=>now+=n};
}
test('atomic retries share exactly one key and deadline',async()=>{const f=fixture();const results=await Promise.all([f.call(),f.call(),f.call()]);assert.equal(f.keys.size,1);assert.ok(results.every(r=>r.code===200&&r.body.api_key===results[0].body.api_key));f.advance(10000);assert.equal((await f.call()).body.expires_at,results[0].body.expires_at);});
test('expiry cannot renew and registry excludes ended access',async()=>{const f=fixture();const r=await f.call();const meta=JSON.parse(f.data.get('key:'+r.body.api_key));assert.ok(exportEntitlement(meta,Date.parse(r.body.issued_at)));f.advance(30*86400000);assert.equal((await f.call()).body.status,'trial_expired');assert.equal(exportEntitlement(meta,Date.parse(r.body.expires_at)),null);assert.equal(f.keys.size,1);});
test('revoked/deleted record cannot be repaired by reconnecting',async()=>{const f=fixture();const r=await f.call();const path='key:'+r.body.api_key;const meta=JSON.parse(f.data.get(path));meta.active=false;f.data.set(path,JSON.stringify(meta));assert.equal((await f.call()).code,403);f.data.delete(path);assert.equal((await f.call()).code,403);});
test('network limit caps fresh installations but preserves existing trials',async()=>{const f=fixture();for(const x of ['a','b','c'])assert.equal((await f.call('astro-install-'+x.repeat(64))).code,200);assert.equal((await f.call('astro-install-'+'d'.repeat(64))).code,429);assert.equal((await f.call()).code,200);assert.equal(f.keys.size,3);});
test('global caps and disabled flag fail without issuing keys',async()=>{const f=fixture();f.data.set('anonymous:daily',25);assert.equal((await f.call()).code,429);f.data.set('anonymous:daily',0);f.data.set('anonymous:pilot-total',250);assert.equal((await f.call()).code,429);f.deps.enabled=()=>false;assert.equal((await f.call()).code,503);assert.equal(f.keys.size,0);});
test('malformed installation or unavailable source address cannot grant',async()=>{const f=fixture();assert.equal((await f.call('bad')).code,400);assert.equal((await f.call(undefined,'unknown')).code,503);assert.equal(f.keys.size,0);});
test('paid metadata untouched and installation token not persisted',async()=>{const f=fixture();f.data.set('key:paid','unchanged');await f.call();assert.equal(f.data.get('key:paid'),'unchanged');assert.ok(!JSON.stringify([...f.data]).includes('astro-install-'));});
