"""Real stdio first-use test: no keys, keyring, account, or trial creation."""
import asyncio
import json
import os
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    env = {k:v for k,v in os.environ.items()
           if k in {'PATH','SYSTEMROOT','WINDIR','TEMP','TMP','HOME','USERPROFILE','SSL_CERT_FILE'}}
    env['PYTHON_KEYRING_BACKEND'] = 'keyring.backends.fail.Keyring'
    params=StdioServerParameters(command=sys.executable,
        args=['-m','astro_intelligence.mcp_server','serve'],env=env,cwd=str(ROOT))
    report=[]
    async with stdio_client(params) as (reader,writer):
        async with ClientSession(reader,writer) as session:
            initialized = await session.initialize()
            from astro_intelligence import __version__
            assert initialized.serverInfo.version == __version__
            tools=await session.list_tools()
            assert len(tools.tools)==4
            for name in ['astro_signal','astro_context','astro_basket']:
                result=await session.call_tool(name,{})
                assert not result.isError, name
                payload=json.loads(next(x.text for x in result.content if x.type=='text'))
                assert payload['status']=='ok' and payload['access']=='public', (name,payload.get('status'))
                data=payload['data']
                assert data.get('last_updated'), name
                if name=='astro_signal': assert 'signals' in data
                if name=='astro_context': assert 'intelligence' in data
                if name=='astro_basket': assert len(data['basket'])==10
                report.append({'tool':name,'status':'ok','source_time':data['last_updated'],'stale':data.get('stale')})
    print(json.dumps({'server_version': initialized.serverInfo.version, 'live_mcp_calls':report,'credentials_supplied':False,'trial_created':False}))

if __name__=='__main__': asyncio.run(main())
