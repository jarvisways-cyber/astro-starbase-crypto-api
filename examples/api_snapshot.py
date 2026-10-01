"""One ASTRO cycle. Local masked key entry; no packages or saved credentials."""
import getpass
import json
import urllib.error
import urllib.request

BASE = 'https://astro-event-horizon.vercel.app'
ROUTES = ('signal', 'context', 'basket')

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def fetch_cycle(key, opener=None):
    if not key or key != key.strip() or '\r' in key or '\n' in key:
        raise ValueError('Enter a nonempty key without surrounding whitespace.')
    opener = opener or urllib.request.build_opener(NoRedirect())
    results = {}
    for route in ROUTES:
        request = urllib.request.Request(BASE + '/api/' + route,
                                         headers={'X-API-Key': key, 'Accept': 'application/json'})
        try:
            with opener.open(request, timeout=20) as response:
                if response.status != 200:
                    raise RuntimeError('Unexpected API response status.')
                payload = json.load(response)
                if not isinstance(payload, dict):
                    raise ValueError('Expected an API object.')
                results[route] = payload
        except urllib.error.HTTPError as exc:
            code = exc.code
            exc.close()
            if code == 429:
                raise RuntimeError('Polling limit: wait 15 minutes before retrying this cycle.') from None
            if code in (401, 403):
                raise RuntimeError('API access denied. Check your subscription/key privately.') from None
            raise RuntimeError('API request failed with HTTP ' + str(code)) from None
        except (OSError, ValueError):
            raise RuntimeError('Network or response error. Do not treat cached data as fresh.') from None
    return results

def main():
    try:
        readings = fetch_cycle(getpass.getpass('ASTRO API key (hidden): '))
        signal, context, basket = (readings[r] for r in ROUTES)
        summary = {
            'composite': signal.get('composite'), 'regime': signal.get('regime'),
            'updated': signal.get('last_updated'),
            'intelligence_quality': (context.get('intelligence') or {}).get('quality'),
            'market_data_stale': (context.get('market_intelligence') or {}).get('stale', True),
            'components': (context.get('signal_explanation') or {}).get('components'),
            'assets': {asset: {k: row.get(k) for k in
                      ('price', 'ascendancy', 'velocity', 'gate', 'stale', 'price_stale')}
                      for asset, row in (basket.get('basket') or {}).items()},
        }
        print(json.dumps(summary, indent=2))
        return 0
    except (ValueError, RuntimeError) as exc:
        print(str(exc))
        return 1

if __name__ == '__main__':
    raise SystemExit(main())
