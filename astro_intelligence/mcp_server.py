"""Public stdio MCP intelligence. No signup, trial, keyring or execution."""
import argparse
import threading
from .client import ASTRO
from . import __version__
from .exceptions import ASTROError, ASTRORateLimitError

def build_server(client=None):
    from mcp.server.fastmcp import FastMCP
    from mcp.types import ToolAnnotations
    server = FastMCP('ASTRO Intelligence', instructions=(
        'Public read-only crypto intelligence; no signup, API key, or trial activation required. '
        'Not trade execution or calibrated winning probabilities. Respect observation timestamps, '
        'missing/stale flags and caching. Never request credentials in chat.'))
    # FastMCP does not expose a version constructor argument in MCP 1.x.
    # Explicitly set the underlying protocol server's version rather than
    # letting it advertise the SDK version. Covered by a real stdio handshake.
    server._mcp_server.version = __version__
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
            except ASTRORateLimitError as error:
                delay = error.retry_after if error.retry_after is not None else 900
                return {'status': 'temporarily_limited', 'retry_after_seconds': max(0, delay),
                        'message': 'Service capacity is temporarily limited. Retry later; no signup is required.'}
            except ASTROError:
                return {'status': 'unavailable',
                        'message': 'Intelligence is temporarily unavailable. No signup or API key is required; retry later.'}
    @server.tool(annotations=annotations)
    def astro_get_started() -> dict:
        """Return connector setup, access and caching guidance without a network request.

        Use when unsure how to connect or access ASTRO. No account, API key or
        trial activation is needed. Use the other tools for market intelligence.
        """
        return {'access': 'public', 'signup_required': False, 'api_key_required': False,
                'trial_required': False, 'setup': 'Call astro_signal, astro_context or astro_basket directly.',
                'website': 'https://64.227.50.56',
                'limits': 'Responses are cached for up to 15 minutes by this connector. Service availability and capacity limits apply.',
                'execution': 'Intelligence and decision support only; no trades or private account access.'}
    @server.tool(annotations=annotations)
    def astro_signal() -> dict:
        """Return a quick market-wide summary: composite score, regime, component
        signals, score shift, BTC price and observation timestamps/stale flags.
        Use first for a concise current market read. Use astro_context for score
        reasoning and auxiliary inputs, or astro_basket for per-asset analysis.
        Scores are not calibrated probabilities of profit. May reuse data for
        up to 15 minutes; inspect source timestamps rather than call time.
        """
        return read('signal')
    @server.tool(annotations=annotations)
    def astro_context() -> dict:
        """Return detailed reasoning behind the market summary: component weights,
        score adjustments, rankings/breadth and available prediction-market,
        macro, sentiment and liquidity context, with missing/stale indicators.
        Use after astro_signal to understand inputs and calculations; use
        astro_basket for individual asset assessments. Available context is
        not a historical archive. May reuse responses for up to 15 minutes.
        """
        return read('context')
    @server.tool(annotations=annotations)
    def astro_basket() -> dict:
        """Return all ten assets (BTC, ETH, SOL, ADA, DOGE, ARB, OP, LINK, POL, DOT)
        with scores, score velocity, funding, available ATR/candle observations,
        strategy assessments and decision explanations, prices and freshness.
        Use to compare assets; astro_signal summarizes the market and
        astro_context explains broader inputs. Takes no filters or history
        parameters. Analytical gates are not orders. Missing observations may
        be null; responses may be reused for up to 15 minutes.
        """
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
