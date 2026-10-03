"""Read-only stdio MCP bridge. Never accepts or returns account credentials."""
import argparse
import getpass
import sys
import threading
import time

from .client import ASTRO
from .exceptions import ASTROError, ASTROAuthError
from .anonymous import load_trial, timestamp, TrialAccess

TRIAL_URL = 'https://64.227.50.56/trial'
SERVICE = 'astro-intelligence-mcp'


def build_server(client=None, key_loader=None, trial_loader=None, clock=time.time):
    from mcp.server.fastmcp import FastMCP
    from mcp.types import ToolAnnotations
    server = FastMCP('ASTRO Intelligence', instructions=(
        'Read-only market intelligence, not trade execution or calibrated winning probabilities. '
        'Respect source timestamps and missing/stale flags. Cached reads are not new observations. '
        'Never ask for API keys, email verification codes or email addresses in chat. '
        'Use astro_get_started for out-of-band setup.'))
    lock = threading.Lock()
    holder = [client]
    entitlement = [None]

    def ended(status):
        return {'status':status,'signup_url':TRIAL_URL,'instruction':'Open the signup link in your browser to continue. Configure your issued key locally with astro-mcp configure; never paste it in chat. No automatic billing.'}

    def read(resource):
        with lock:
            if entitlement[0] and timestamp(entitlement[0]['expires_at'])<=clock():
                return ended('trial_expired')
            if holder[0] is None:
                try:
                    if key_loader:
                        key=key_loader()
                    else:
                        record=trial_loader() if trial_loader else load_trial(secure_keyring())
                        key=record['api_key']
                        if record.get('expires_at'):entitlement[0]=record
                    if not key:
                        return {'status': 'setup_required', 'signup_url': TRIAL_URL,
                                'instruction': 'Sign up in your browser, then run astro-mcp configure locally. Never send credentials to this tool.'}
                    holder[0] = ASTRO(api_key=key)
                except TrialAccess as exc:
                    return ended(exc.status)
                except Exception:
                    return {'status': 'setup_required', 'instruction': 'Run astro-mcp configure locally with an OS credential store. Do not paste keys in chat.'}
            try:
                result={'status': 'ok', 'resource': resource, 'cache_max_age_seconds': 900,
                        'notice': 'May reuse the last response for 15 minutes. Inspect its observation timestamps and quality flags.',
                        'data': getattr(holder[0], resource)()}
                if entitlement[0]:
                    result['trial']={'expires_at':entitlement[0]['expires_at'],'signup_url':TRIAL_URL,'days_remaining':max(0,int((timestamp(entitlement[0]['expires_at'])-clock()+86399)//86400)),'automatic_billing':False}
                return result
            except ASTROAuthError:
                if entitlement[0] and clock()-timestamp(entitlement[0]['issued_at'])<300:
                    return {'status':'activating','retry_after_seconds':60,'message':'Your trial is issued; access synchronization is pending. Retry this tool in a minute.'}
                return ended('access_rejected')
            except ASTROError:
                return {'status': 'unavailable', 'message': 'ASTRO request failed or access was rejected. Check access and the polling interval; no expired fallback returned.'}

    # Intelligence calls may create the first-use trial credential (never trades).
    annotations = ToolAnnotations(readOnlyHint=False, destructiveHint=False, idempotentHint=True, openWorldHint=True)

    @server.tool(annotations=ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=True))
    def astro_get_started() -> dict:
        """Explain private signup and setup; does not create accounts or send emails."""
        return {'signup_url': TRIAL_URL, 'trial_days': 30, 'billing': 'No automatic charge or renewal',
                'setup': 'Install and connect the connector. First intelligence use automatically activates a 30-day anonymous trial, subject to capacity, using your native OS credential store. May take a minute to synchronize. Email signup is optional until access ends.',
                'privacy': 'Never paste verification codes or API keys into this conversation.',
                'existing_customers': 'Use your existing API key; no new trial is needed.'}

    @server.tool(annotations=annotations)
    def astro_signal() -> dict:
        """Read ASTRO composite, components and source metadata; no orders."""
        return read('signal')

    @server.tool(annotations=annotations)
    def astro_context() -> dict:
        """Read market context, component explanations and available prediction-market inputs."""
        return read('context')

    @server.tool(annotations=annotations)
    def astro_basket() -> dict:
        """Read the supported asset basket with quotes, gates, volatility and freshness."""
        return read('basket')

    return server


def secure_keyring():
    import keyring
    backend = keyring.get_keyring()
    # Fail closed instead of silently using a plaintext fallback backend.
    module = type(backend).__module__
    if module not in {'keyring.backends.Windows', 'keyring.backends.macOS', 'keyring.backends.SecretService'}:
        raise RuntimeError('A native Windows, macOS or Secret Service credential store is required.')
    return keyring


def load_key():
    return secure_keyring().get_password(SERVICE, 'api-key')


def main():
    parser = argparse.ArgumentParser(description='ASTRO read-only MCP connector')
    parser.add_argument('action', choices=['serve', 'configure'], nargs='?', default='serve')
    args = parser.parse_args()
    if args.action == 'configure':
        if not sys.stdin.isatty():
            raise SystemExit('Run configure in an interactive local terminal; piped credentials are not accepted.')
        store = secure_keyring()
        key = getpass.getpass('ASTRO API key (hidden, saved to your OS credential store): ').strip()
        if not key or len(key)>512 or any(ord(c) < 33 or ord(c) > 126 for c in key):
            raise SystemExit('Invalid key format. Nothing saved.')
        store.set_password(SERVICE, 'api-key', key)
        print('Saved to the OS credential store. Restart your MCP client to use it.')
    else:
        build_server().run(transport='stdio')


if __name__ == '__main__':
    main()
