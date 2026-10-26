"""Read ASTRO public intelligence once. No credentials or trading actions."""
import json
from urllib.request import Request, urlopen


def main():
    snapshot = {}
    for resource in ('signal', 'context', 'basket'):
        request = Request(
            f'https://64.227.50.56/api/public/{resource}',
            headers={'Accept': 'application/json', 'User-Agent': 'ASTRO-public-example/0.7.1'},
        )
        with urlopen(request, timeout=30) as response:
            snapshot[resource] = json.load(response)
    # Preserve nulls, timestamps, quality flags and version fields unchanged.
    print(json.dumps(snapshot, indent=2, allow_nan=False))


if __name__ == '__main__':
    main()
