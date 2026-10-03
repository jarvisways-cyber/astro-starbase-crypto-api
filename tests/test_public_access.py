import responses
import pytest
from astro_intelligence.client import ASTRO, DEFAULT_BASE_URL
from astro_intelligence.exceptions import ASTROError

@responses.activate
def test_public_never_sends_existing_key_or_creates_trial(monkeypatch):
    monkeypatch.setenv('ASTRO_API_KEY','fixture-must-not-send')
    data={'stale':True,'last_updated':'old','signals':{'missing':None},'extra':{'explanation':'retained'}}
    responses.get(DEFAULT_BASE_URL+'/api/public/signal',json=data)
    client=ASTRO(api_key='another-fixture',public_access=True)
    assert client.signal()==data
    assert client.signal()==data
    assert len(responses.calls)==1
    assert 'X-API-Key' not in responses.calls[0].request.headers
    assert 'Authorization' not in responses.calls[0].request.headers

@responses.activate
def test_public_redirect_is_not_followed():
    responses.get(DEFAULT_BASE_URL+'/api/public/context',status=302,headers={'Location':'https://example.com'})
    with pytest.raises(ASTROError):ASTRO(public_access=True).context()
    assert len(responses.calls)==1

@responses.activate
def test_paid_sdk_route_still_works():
    responses.get(DEFAULT_BASE_URL+'/api/context',json={'old_client':True})
    assert ASTRO(api_key='fixture').context()=={'old_client':True}
    assert responses.calls[0].request.headers['X-API-Key']=='fixture'
