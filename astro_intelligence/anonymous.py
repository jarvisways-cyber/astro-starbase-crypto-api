"""Private first-use activation. No hardware fingerprint, key in tool output, or redirects."""
import json
import secrets
import time
from datetime import datetime
import requests

ORIGIN='https://astro-event-horizon.vercel.app'
SERVICE='astro-intelligence-mcp'

def timestamp(value):
    return datetime.fromisoformat(value.replace('Z','+00:00')).timestamp()

class TrialAccess(Exception):
    def __init__(self,status='unavailable'):
        self.status=status

def load_trial(store, session=None, clock=time.time):
    # A manually configured existing key always takes precedence.
    existing=store.get_password(SERVICE,'api-key')
    if existing:return {'api_key':existing}
    raw=store.get_password(SERVICE,'anonymous-trial')
    if raw:
        record=json.loads(raw)
        if timestamp(record['expires_at'])<=clock():raise TrialAccess('trial_expired')
        return record
    token=store.get_password(SERVICE,'installation')
    if not token:
        token='astro-install-'+secrets.token_hex(32)
        store.set_password(SERVICE,'installation',token)
    # Persist the recovery identity BEFORE network activity. Retries get same key/deadline.
    transport=session or requests.Session()
    try:
        response=transport.post(ORIGIN+'/api/mcp-trial',headers={'X-ASTRO-Installation':token},json={'terms_version':'2026-10-02'},timeout=20,allow_redirects=False)
        try:
            if response.status_code!=200:
                status=response.json().get('status','unavailable') if response.status_code in (403,429,503) else 'unavailable'
                raise TrialAccess(status if status in ('trial_expired','access_ended','signup_required','retry_later') else 'unavailable')
            record=response.json()
            key=record.get('api_key','')
            if not isinstance(key,str) or not key.startswith('astro-anon-') or len(key)!=59 or any(c not in '0123456789abcdef' for c in key[11:]):raise TrialAccess()
            if timestamp(record['expires_at'])<=clock():raise TrialAccess('trial_expired')
            safe={k:record[k] for k in ('api_key','issued_at','expires_at')}
            store.set_password(SERVICE,'anonymous-trial',json.dumps(safe))
            return safe
        finally:response.close()
    except requests.RequestException:
        raise TrialAccess() from None
    finally:
        if session is None:transport.close()
