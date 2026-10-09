import asyncio
import json
import pytest
from astro_intelligence.mcp_server import build_server
from astro_intelligence.exceptions import ASTRORateLimitError

@pytest.mark.parametrize('delay,expected', [(120,120),(900,900),(0,0),(None,900)])
def test_provider_retry_delay_reaches_mcp_client(delay, expected):
    class Limited:
        def signal(self):
            raise ASTRORateLimitError('not for the response', delay)
    result = asyncio.run(build_server(client=Limited()).call_tool('astro_signal', {}))
    blocks = result[0] if isinstance(result, tuple) else result
    payload = json.loads(next(block.text for block in blocks if block.type == 'text'))
    assert payload['status'] == 'temporarily_limited'
    assert payload['retry_after_seconds'] == expected
