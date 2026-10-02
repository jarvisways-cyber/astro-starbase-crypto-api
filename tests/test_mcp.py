import asyncio
from astro_intelligence.mcp_server import build_server, TRIAL_URL
from astro_intelligence.exceptions import ASTROAuthError

def run(awaitable):
    return asyncio.run(awaitable)

class Client:
    def signal(self):
        return {'composite': 42, 'shift': None, 'stale': True}
    def context(self):
        return {'prediction_market': None, 'director': {'veto': 'missing_evidence'}}
    def basket(self):
        return {'basket': {'BTC': {'price': None, 'gate': False}}}

def test_only_read_only_tools_and_no_secret_inputs():
    tools = run(build_server(client=Client()).list_tools())
    assert {t.name for t in tools} == {'astro_get_started','astro_signal','astro_context','astro_basket'}
    for t in tools:
        assert t.annotations.readOnlyHint
        assert not t.inputSchema.get('properties')

def test_missing_key_only_gives_private_setup_instructions():
    result = run(build_server(key_loader=lambda: None).call_tool('astro_signal', {}))
    assert 'setup_required' in str(result)
    assert TRIAL_URL in str(result)

def test_source_null_stale_and_decision_support_preserved():
    server = build_server(client=Client())
    result = run(server.call_tool('astro_signal', {}))
    assert 'true' in str(result).lower()
    assert 'null' in str(result).lower() or 'None' in str(result)
    assert 'missing_evidence' in str(run(server.call_tool('astro_context', {})))
    assert 'gate' in str(run(server.call_tool('astro_basket', {})))

def test_private_auth_error_is_not_returned():
    class Failed(Client):
        def signal(self):
            raise ASTROAuthError('fixture-private-never-return')
    result = run(build_server(client=Failed()).call_tool('astro_signal', {}))
    assert 'fixture-private-never-return' not in str(result)
    assert 'unavailable' in str(result)

def test_real_stdio_protocol_handshake_and_tool_roundtrip():
    import sys
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    async def exercise():
        params=StdioServerParameters(command=sys.executable,args=['-m','astro_intelligence.mcp_server','serve'])
        async with stdio_client(params) as (read,write):
            async with ClientSession(read,write) as session:
                init=await session.initialize()
                assert init.serverInfo.name=='ASTRO Intelligence'
                listed=await session.list_tools()
                assert len(listed.tools)==4
                result=await session.call_tool('astro_get_started',{})
                assert not result.isError
                assert TRIAL_URL in str(result)
    run(exercise())
