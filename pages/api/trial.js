import {Redis} from '@upstash/redis';
import nodemailer from 'nodemailer';
import {createSelfServiceTrial} from '../../lib/self_service_trial.mjs';
import {trialEmail} from '../../lib/trial_access.mjs';
export const config={api:{bodyParser:{sizeLimit:'8kb'}}};
let handler;
export default async function trial(req,res) {
  if(!handler) {
    const transport=nodemailer.createTransport({service:'gmail',connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,auth:{user:'jarvisways@gmail.com',pass:process.env.GMAIL_APP_PASSWORD}});
    const send=mail=>transport.sendMail({from:'"ASTRO Intelligence" <jarvisways@gmail.com>',...mail});
    handler=createSelfServiceTrial({redis:new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN}),
      sendVerification:({email,code})=>send({to:email,subject:'Verify your ASTRO trial request',text:`Your ASTRO verification code is ${code}. It expires in ten minutes. Enter it only on https://astro-event-horizon.vercel.app/trial — never in an AI conversation. If you did not request this, ignore this email. No API access or billing has been created.`}),
      sendTrial:r=>send(trialEmail(r))});
  }
  return handler(req,res);
}
