import test from 'node:test';
import assert from 'node:assert/strict';
import {createKeysHandler} from '../lib/keys_handler.mjs';
import {oracleProxy} from '../lib/oracle_proxy.mjs';
const response=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;}});
test('unconfigured and unauthorized sync never touches Redis',async()=>{
 let calls=0;const redis={smembers(){calls++;throw Error();}};
 for(const [secret,header,code] of [[undefined,undefined,503],['',undefined,503],['fixture-secret',undefined,401],['fixture-secret','wrong',401]]){
  const res=response();await createKeysHandler(redis,()=>secret)({method:'GET',headers:{'x-astro-secret':header}},res);assert.equal(res.code,code);
 }assert.equal(calls,0);
});
test('sync preserves hosted records and omits revoked records',async()=>{
 const redis={async smembers(){return ['fixture-active','fixture-revoked'];},async get(k){return k.endsWith('active')?{tier:'pro'}:null;}};
 const res=response();await createKeysHandler(redis,()=> 'fixture-secret')({method:'GET',headers:{'x-astro-secret':'fixture-secret'}},res);
 assert.equal(res.code,200);assert.deepEqual(Object.keys(res.body),['fixture-active']);assert.equal(res.headers['Cache-Control'],'no-store');
});
test('malformed registry fails without exposing exception text',async()=>{
 const res=response();await createKeysHandler({async smembers(){throw Error('private details');}},()=> 'fixture-secret')({method:'GET',headers:{'x-astro-secret':'fixture-secret'}},res);
 assert.equal(res.code,503);assert.ok(!JSON.stringify(res.body).includes('private'));
});
test('administrative export preserves internal roles rather than changing hosted access',async()=>{
 const redis={async smembers(){return ['fixture-internal'];},async get(){return {tier:'internal',active:true};}};
 const res=response();await createKeysHandler(redis,()=> 'fixture-secret')({method:'GET',headers:{'x-astro-secret':'fixture-secret'}},res);
 assert.equal(res.code,200);assert.equal(res.body['fixture-internal'].tier,'internal');
});
test('all three proxies forward header auth and preserve stale responses',async()=>{
 const oldFetch=globalThis.fetch,oldOrigin=process.env.ASTRO_UPSTREAM_ORIGIN;
 process.env.ASTRO_UPSTREAM_ORIGIN='https://fixture.invalid';
 try {for(const path of ['composite','context','basket']){
  globalThis.fetch=async(url,options)=>{assert.equal(url.pathname,'/oracle/'+path);assert.equal(url.search,'');assert.equal(options.headers['X-API-Key'],'fixture-customer');assert.equal(options.redirect,'error');return {status:200,json:async()=>({stale:true})};};
  const res=response();await oracleProxy({method:'GET',headers:{'x-api-key':'fixture-customer'},query:{}},res,path);assert.equal(res.code,200);assert.equal(res.body.stale,true);
 }}finally{globalThis.fetch=oldFetch;if(oldOrigin===undefined)delete process.env.ASTRO_UPSTREAM_ORIGIN;else process.env.ASTRO_UPSTREAM_ORIGIN=oldOrigin;}
});
test('proxy rejects missing auth before attempting a request',async()=>{
 const res=response();await oracleProxy({method:'GET',headers:{},query:{}},res,'basket');assert.equal(res.code,401);
});
