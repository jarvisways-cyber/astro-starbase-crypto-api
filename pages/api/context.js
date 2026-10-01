import { oracleProxy } from '../../lib/oracle_proxy.mjs';
export default function handler(req,res) { return oracleProxy(req,res,'context'); }
