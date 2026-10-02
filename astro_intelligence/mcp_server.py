"""Read-only stdio MCP bridge. Never accepts or returns account credentials."""
import argparse
import getpass
import sys
import threading

from .client import ASTRO
from .exceptions import ASTROError

TRIAL_URL = 'https://astro-event-horizon.vercel.app/trial'
SERVICE = 'astro-intelligence-mcp'


def build_server(client=None, key_loader=None):
    from mcp.server.fastmcp import FastMCP
    from mcp.types import ToolAnnotations
    server = FastMCP('ASTRO Intelligence', instructions=(
        'Read-only market intelligence, not trade execution or calibrated winning probabilities. '
        'Respect source timestamps and missing/stale flags. Cached reads are not new observations. '
        'Never ask for API keys, email verification codes or email addresses in chat. '
        'Use astro_get_started for out-of-band setup.'))
    lock = threading.Lock()
    holder = [client]

    def read(resource):
        with lock:
            if holder[0] is None:
                try:
                    key = key_loader() if key_loader else load_key()
                    if not key:
                        return {'status': 'setup_required', 'signup_url': TRIAL_URL,
                                'instruction': 'Sign up in your browser, then run astro-mcp configure locally. Never send credentials to this tool.'}
                    holder[0] = ASTRO(api_key=key)
                except Exception:
                    return {'status': 'setup_required', 'instruction': 'Run astro-mcp configure locally with an OS credential store. Do not paste keys in chat.'}
            try:
                return {'status': 'ok', 'resource': resource, 'cache_max_age_seconds': 900,
                        'notice': 'May reuse the last response for 15 minutes. Inspect its observation timestamps and quality flags.',
                        'data': getattr(holder[0], resource)()}
            except ASTROError:
                return {'status': 'unavailable', 'message': 'ASTRO request failed or access was rejected. Check access and the polling interval; no expired fallback returned.'}

    annotations = ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=True)

    @server.tool(annotations=annotations)
    def astro_get_started() -> dict:
        """Explain private signup and setup; does not create accounts or send emails."""
        return {'signup_url': TRIAL_URL, 'trial_days': 30, 'billing': 'No automatic charge or renewal',
                'setup': 'Install the connector, verify email on the website, then run astro-mcp configure in a local terminal.',
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
