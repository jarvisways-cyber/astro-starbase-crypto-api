import asyncio,json
import pytest
from astro_intelligence.anonymous import load_trial,TrialAccess,SERVICE
from astro_intelligence.mcp_server import build_server

class Store:
    def __init__(self):self.data={}
    def get_password(self,s,k):return self.data.get(k)
    def set_password(self,s,k,v):self.data[k]=v
class Response:
    status_code=200
    def json(self):return {'api_key':'astro-anon-'+'a'*48,'issued_at':'2026-10-02T00:00:00Z','expires_at':'2026-11-01T00:00:00Z'}
    def close(self):pass
class Session:
    def __init__(self):self.calls=[]
    def post(self,*a,**kw):self.calls.append((a,kw));return Response()
def test_local_reconnect_preserves_identity_and_never_sends_key_in_url():
    s=Store();h=Session();r=load_trial(s,h,clock=lambda:1790985600)
    assert load_trial(s,h,clock=lambda:1790985601)==r
    assert len(h.calls)==1 and h.calls[0][1]['allow_redirects'] is False
    assert 'api_key' not in h.calls[0][1]['json']
    token=s.data['installation'];del s.data['anonymous-trial']
    load_trial(s,h,clock=lambda:1790985601)
    assert h.calls[-1][1]['headers']['X-ASTRO-Installation']==token
def test_expired_local_record_never_requests_fresh_trial():
    s=Store();h=Session();load_trial(s,h,clock=lambda:1790985600)
    with pytest.raises(TrialAccess) as e:load_trial(s,h,clock=lambda:1890985600)
    assert e.value.status=='trial_expired' and len(h.calls)==1
def test_paid_key_precedes_anonymous_entitlement():
    s=Store();s.data['api-key']='fixture-existing';h=Session()
    assert load_trial(s,h)['api_key']=='fixture-existing' and not h.calls
def test_mcp_enforces_expiry_before_using_cached_data(monkeypatch):
    class Client:
        def __init__(self,**kw):pass
        def signal(self):return {'gate':False,'reason':'fixture'}
    monkeypatch.setattr('astro_intelligence.mcp_server.ASTRO',Client)
    now=[1790985600]
    server=build_server(trial_loader=lambda:Response().json(),clock=lambda:now[0])
    def call():return json.loads(asyncio.run(server.call_tool('astro_signal',{}))[0].text)
    first=call();assert first['data']['gate'] is False and 'api_key' not in json.dumps(first)
    now[0]=1890985600
    assert call()['status']=='trial_expired' and 'data' not in call()
def test_mcp_does_not_expose_activation_exception():
    def fail():raise TrialAccess('signup_required')
    result=asyncio.run(build_server(trial_loader=fail).call_tool('astro_signal',{}))
    assert 'signup_required' in str(result) and '/trial' in str(result)
