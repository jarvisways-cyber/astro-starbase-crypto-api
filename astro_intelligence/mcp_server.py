"""Public stdio MCP intelligence. No signup, trial, keyring or execution."""
import argparse
import threading
from .client import ASTRO
from .exceptions import ASTROError, ASTRORateLimitError

def build_server(client=None):
    from mcp.server.fastmcp import FastMCP
    from mcp.types import ToolAnnotations
    server = FastMCP('ASTRO Intelligence', instructions=(
        'Public read-only crypto intelligence; no signup, API key, or trial activation required. '
        'Not trade execution or calibrated winning probabilities. Respect observation timestamps, '
        'missing/stale flags and caching. Never request credentials in chat.'))
    source = client if client is not None else ASTRO(public_access=True)
    lock = threading.Lock()
    annotations = ToolAnnotations(readOnlyHint=True, destructiveHint=False,
                                  idempotentHint=True, openWorldHint=True)
    def read(resource):
        with lock:
            try:
                return {'status': 'ok', 'access': 'public', 'resource': resource,
                        'cache_max_age_seconds': 900,
                        'notice': 'May reuse a response for 15 minutes. Inspect source timestamps and quality flags.',
                        'data': getattr(source, resource)()}
            except ASTRORateLimitError:
                return {'status': 'temporarily_limited', 'retry_after_seconds': 60,
                        'message': 'Service capacity is temporarily limited. Retry later; no signup is required.'}
            except ASTROError:
                return {'status': 'unavailable',
                        'message': 'Intelligence is temporarily unavailable. No signup or API key is required; retry later.'}
    @server.tool(annotations=annotations)
    def astro_get_started() -> dict:
        """Explain public access; no signup, credentials or trial activation needed."""
        return {'access': 'public', 'signup_required': False, 'api_key_required': False,
                'trial_required': False, 'setup': 'Call astro_signal, astro_context or astro_basket directly.',
                'website': 'https://64.227.50.56',
                'limits': 'Responses are cached for up to 15 minutes by this connector. Service availability and capacity limits apply.',
                'execution': 'Intelligence and decision support only; no trades or private account access.'}
    @server.tool(annotations=annotations)
    def astro_signal() -> dict:
        """Read composite, market regime, component signals and source timestamps."""
        return read('signal')
    @server.tool(annotations=annotations)
    def astro_context() -> dict:
        """Read market context, score explanations and available prediction-market inputs."""
        return read('context')
    @server.tool(annotations=annotations)
    def astro_basket() -> dict:
        """Read ten-asset rankings, funding, volatility, strategy assessments and freshness."""
        return read('basket')
    return server

def main():
    parser = argparse.ArgumentParser(description='ASTRO public read-only MCP connector')
    parser.add_argument('action', choices=['serve', 'configure'], nargs='?', default='serve')
    args = parser.parse_args()
    if args.action == 'configure':
        print('No configuration or API key is required. Connect using astro-mcp serve. Existing saved credentials are untouched.')
    else: build_server().run(transport='stdio')

if __name__ == '__main__': main()
