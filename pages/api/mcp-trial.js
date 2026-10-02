import {Redis} from '@upstash/redis';
import {createAnonymousTrial} from '../../lib/anonymous_trial.mjs';
let handler;
export default function trial(req,res){
 if(!handler)handler=createAnonymousTrial({redis:new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN})});
 return handler(req,res);
}
