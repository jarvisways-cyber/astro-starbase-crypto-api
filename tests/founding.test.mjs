import test from 'node:test';
import assert from 'node:assert/strict';
import {FOUNDING_START, FOUNDING_END, botEntitlement, exportEntitlement} from '../lib/founding_offer.mjs';
import {fulfillCheckout, purchaseEmail} from '../lib/purchase_fulfillment.mjs';
import {createKeysHandler} from '../lib/keys_handler.mjs';

const paid = Math.floor(FOUNDING_START / 1000);
function fixture(overrides={}) {
  const values=new Map(); const members=new Set(); const mails=[];
  const redis={async get(k){return values.get(k) ?? null;},async set(k,v,opts){if(opts?.nx && values.has(k))return null;values.set(k,v);return 'OK';},async sadd(k,v){members.add(v);},async smembers(){return [...members];}};
  const event={type:'checkout.session.completed',livemode:true,created:paid,data:{object:{id:'cs_fixture',livemode:true,payment_status:'paid',mode:'payment',customer_details:{email:'fixture@example.invalid'},...overrides}}};
  const stripe={checkout:{sessions:{async listLineItems(){return {has_more:false,data:[{quantity:1,price:{id:'price_1To6gQFwvxiyT5vxlwbzhuN3'}}]};}}}};
  const args={event,stripe,redis,sendEmail:async record=>mails.push(record),now:()=>FOUNDING_START+100000};
  return {args,values,members,mails};
}
test('Alaska founding boundaries are inclusive start and exclusive end',()=>{
  for(const [ms,kind] of [[FOUNDING_START-1000,'bot_included_access'],[FOUNDING_START,'founding_supporter'],[FOUNDING_END-1000,'founding_supporter'],[FOUNDING_END,'bot_included_access']]) assert.equal(botEntitlement(ms/1000).kind,kind);
  assert.equal(botEntitlement(paid).access_until,undefined);
  assert.throws(()=>botEntitlement(NaN));
});
test('ordinary three-calendar-month benefit clamps month-end and actually expires',()=>{
  const ent=botEntitlement(Date.parse('2027-11-30T12:00:00Z')/1000);
  assert.equal(ent.access_until,'2028-02-29T12:00:00.000Z');
  const value={tier:'starter',active:true,entitlement:ent};
  const end=Date.parse(ent.access_until);
  assert.equal(exportEntitlement(value,end-1),value);
  assert.equal(exportEntitlement(value,end),null);
  assert.equal(exportEntitlement({...value,entitlement:{access_until:'bad'}},0),null);
});
test('bot purchase creates one full-access key, private download and combined email',async()=>{
  const f=fixture();assert.deepEqual(await fulfillCheckout(f.args),{received:true});
  assert.equal(f.members.size,1);assert.equal(f.mails.length,1);
  const record=f.mails[0];assert.match(record.key,/^astro-starter-[a-f0-9]{48}$/);
  assert.equal(record.entitlement.kind,'founding_supporter');
  const key=JSON.parse(f.values.get('key:'+record.key));assert.equal(key.tier,'starter');assert.equal(key.active,true);
  assert.ok(f.values.has('download_token:'+record.token));
  assert.match(purchaseEmail(record).html,/without an additional subscription charge/);
  assert.match(purchaseEmail(record).html,/paper-only/);
});
test('duplicate and concurrent delivery reuse the same key and token',async()=>{
  const f=fixture();await Promise.all([fulfillCheckout(f.args),fulfillCheckout(f.args)]);
  assert.equal(f.members.size,1);
  assert.equal(new Set(f.mails.map(x=>x.key)).size,1);
  assert.equal(new Set(f.mails.map(x=>x.token)).size,1);
  const count=f.mails.length;await fulfillCheckout(f.args);assert.equal(f.mails.length,count);
});
test('SMTP failure retries original entitlement even after cohort closes',async()=>{
  const f=fixture();f.args.sendEmail=async()=>{throw Error('fixture delivery failure');};
  await assert.rejects(fulfillCheckout(f.args));const key=[...f.members][0];
  f.args.now=()=>FOUNDING_END+10000;f.args.sendEmail=async r=>f.mails.push(r);
  await fulfillCheckout(f.args);assert.equal(f.mails[0].key,key);assert.equal(f.mails[0].entitlement.kind,'founding_supporter');
});
test('delayed webhook eligibility uses payment event, not processing time',async()=>{
  const f=fixture();f.args.now=()=>FOUNDING_END+10000;await fulfillCheckout(f.args);
  assert.equal(f.mails[0].entitlement.kind,'founding_supporter');
});
test('test-mode, unpaid and unrelated events never write or send',async()=>{
  for(const mutate of [f=>f.args.event.livemode=false,f=>f.args.event.data.object.livemode=false,f=>f.args.event.data.object.payment_status='unpaid',f=>f.args.event.type='customer.updated']){
    const f=fixture();mutate(f);assert.deepEqual(await fulfillCheckout(f.args),{ignored:true});assert.equal(f.values.size,0);assert.equal(f.mails.length,0);
  }
});
test('line-item failure cannot accidentally mint a subscription key',async()=>{
  const f=fixture();f.args.stripe.checkout.sessions.listLineItems=async()=>{throw Error('fixture');};
  await assert.rejects(fulfillCheckout(f.args));assert.equal(f.values.size,0);
});
test('unknown one-time product is rejected; recurring API plan still works',async()=>{
  const f=fixture();f.args.stripe.checkout.sessions.listLineItems=async()=>({data:[{quantity:1,price:{id:'api_fixture',recurring:{interval:'month'}}}],has_more:false});
  await assert.rejects(fulfillCheckout(f.args));f.args.event.data.object.mode='subscription';
  await fulfillCheckout(f.args);assert.equal(f.mails[0].entitlement.kind,'api_subscription');assert.equal(f.mails[0].token,undefined);
});
test('retry cannot revive revoked access',async()=>{
  const f=fixture();await fulfillCheckout(f.args);const k='key:'+f.mails[0].key;
  const record=JSON.parse(f.values.get(k));record.active=false;f.values.set(k,JSON.stringify(record));
  await fulfillCheckout(f.args);assert.equal(JSON.parse(f.values.get(k)).active,false);
});
test('legacy subscriber key is preserved on replay',async()=>{
  const f=fixture({mode:'subscription'});f.values.set('session:cs_fixture','astro-starter-fixturelegacy');
  f.args.stripe.checkout.sessions.listLineItems=async()=>({has_more:false,data:[{quantity:1,price:{id:'fixture',recurring:{interval:'month'}}}]});
  await fulfillCheckout(f.args);assert.equal(f.mails[0].key,'astro-starter-fixturelegacy');
});
test('actual sync handler exports founder and preserves legacy roles, excludes expired/test keys',async()=>{
  const f=fixture();await fulfillCheckout(f.args);
  for(const [name,record] of [['expired',{tier:'starter',entitlement:{access_until:'2020-01-01T00:00:00Z'}}],['test',{tier:'starter',livemode:false}],['legacy',{tier:'pro',active:true}]]){f.members.add(name);f.values.set('key:'+name,record);}
  const res={status(n){this.code=n;return this;},setHeader(){},json(body){this.body=body;return this;}};
  await createKeysHandler(f.args.redis,()=> 'fixture-secret')({method:'GET',headers:{'x-astro-secret':'fixture-secret'}},res);
  assert.equal(res.code,200);assert.equal(Object.keys(res.body).length,2);assert.ok(res.body[f.mails[0].key]);assert.ok(res.body.legacy);
});
