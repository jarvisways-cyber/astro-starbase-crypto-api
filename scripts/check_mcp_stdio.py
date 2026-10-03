"""Exercise the installed MCP server over stdio without activating a trial."""
import asyncio
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    params = StdioServerParameters(
        command=sys.executable,
        args=['-m', 'astro_intelligence.mcp_server', 'serve'],
    )
    async with stdio_client(params) as (reader, writer):
        async with ClientSession(reader, writer) as session:
            initialized = await session.initialize()
            assert initialized.serverInfo.name == 'ASTRO Intelligence'
            tools = await session.list_tools()
            expected = {'astro_get_started', 'astro_signal', 'astro_context', 'astro_basket'}
            assert {tool.name for tool in tools.tools} == expected
            result = await session.call_tool('astro_get_started', {})
            assert not result.isError
            assert 'signup_required' in str(result)
            print('PASS: real stdio initialization, four tools, and setup call.')
            print('No intelligence calls, trial activation, credentials, or email required.')


if __name__ == '__main__':
    asyncio.run(main())
