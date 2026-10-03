import responses
import pytest
from astro_intelligence.client import ASTRO, DEFAULT_BASE_URL
from astro_intelligence.anonymous import ORIGIN,SERVICE
from astro_intelligence.exceptions import ASTROError

def test_data_origin_moves_without_resetting_account_identity():
    assert DEFAULT_BASE_URL=='https://64.227.50.56'
    assert ORIGIN=='https://64.227.50.56'
    assert SERVICE=='astro-intelligence-mcp'

@responses.activate
def test_direct_failure_does_not_silently_fallback_to_old_tunnel():
    responses.get(DEFAULT_BASE_URL+'/api/signal',status=503)
    with pytest.raises(ASTROError):ASTRO(api_key='fixture-only').signal()
    assert len(responses.calls)==1

@responses.activate
def test_explicit_existing_website_origin_still_supported():
    legacy='https://astro-event-horizon.vercel.app'
    responses.get(legacy+'/api/context',json={'fixture':True})
    assert ASTRO(api_key='fixture-only',base_url=legacy).context()=={'fixture':True}
