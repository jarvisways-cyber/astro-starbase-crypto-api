// Staged only: install alongside hosted handlers after routing/config verification.
export async function oracleProxy(req,res,path) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'method not allowed'});
  const key=req.headers['x-api-key'] || req.query.api_key;
  if(typeof key!=='string'||!key||/[\r\n]/.test(key))return res.status(401).json({error:'API key required'});
  let base;
  try {
    base=new URL(process.env.ASTRO_UPSTREAM_ORIGIN);
    if(base.protocol!=='https:'||base.username||base.password||base.pathname!=='/'||base.search||base.hash)throw Error();
  } catch {return res.status(503).json({error:'upstream not configured'});}
  if(!['composite','context','basket'].includes(path))return res.status(404).json({error:'not found'});
  try {
    const upstream=await fetch(new URL('/oracle/'+path,base),{
      headers:{'X-API-Key':key,'ngrok-skip-browser-warning':'1'},
      redirect:'error',signal:AbortSignal.timeout(10000)
    });
    const data=await upstream.json();
    return res.status(upstream.status).json(data);
  } catch {return res.status(502).json({error:'upstream unavailable'});}
}
