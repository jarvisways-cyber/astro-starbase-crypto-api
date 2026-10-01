import {Redis} from '@upstash/redis';
import nodemailer from 'nodemailer';
import {createTrialHandler,trialEmail} from '../../../lib/trial_access.mjs';
export const config={api:{bodyParser:{sizeLimit:'8kb'}}};
let handler;
export default async function trials(req,res) {
  if(!handler)handler=createTrialHandler({
    redis:new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN}),
    sendEmail:async record=>{
      const transport=nodemailer.createTransport({service:'gmail',auth:{user:'jarvisways@gmail.com',pass:process.env.GMAIL_APP_PASSWORD}});
      await transport.sendMail({from:'"ASTRO Intelligence" <jarvisways@gmail.com>',...trialEmail(record)});
    }
  });
  return handler(req,res);
}
