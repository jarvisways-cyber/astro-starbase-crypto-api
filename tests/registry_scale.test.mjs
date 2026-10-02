import test from 'node:test';
import assert from 'node:assert/strict';
import {createKeysHandler} from '../lib/keys_handler.mjs';
function response(){return {code:200,setHeader(){},status(n){this.code=n;return this;},json(b){this.body=b;return this;}};}
test('1000 registry records use four bounded batches, preserve roles and expiry',async()=>{
 const keys=Array.from({length:1000},(_,i)=>'synthetic-'+i);let calls=0;
 const redis={smembers:async()=>keys,mget:async(...names)=>{calls++;assert.ok(names.length<=250);return names.map(name=>name==='key:synthetic-0'?null:name==='key:synthetic-1'?{tier:'starter',entitlement:{access_until:'2000-01-01T00:00:00Z'}}:{tier:'starter',active:true});},get:async()=>{throw Error('unexpected per-key fetch');}};
 const res=response();await createKeysHandler(redis,()=> 'fixture')({method:'GET',headers:{'x-astro-secret':'fixture'}},res);
 assert.equal(res.code,200);assert.equal(calls,4);assert.equal(Object.keys(res.body).length,998);
});
test('partial malformed batch fails closed rather than exporting incomplete registry',async()=>{
 const res=response();await createKeysHandler({smembers:async()=>['fixture'],mget:async()=>[]},()=> 'fixture')({method:'GET',headers:{'x-astro-secret':'fixture'}},res);
 assert.equal(res.code,503);
});
