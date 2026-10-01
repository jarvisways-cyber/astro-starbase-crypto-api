"""Offline example checks; no customer credential or network required."""
import io
import json
import unittest
import urllib.error
from api_snapshot import BASE, ROUTES, NoRedirect, fetch_cycle

class Response(io.BytesIO):
    status = 200

class ExampleTests(unittest.TestCase):
    def test_complete_cycle_uses_header_and_keeps_zero_and_null(self):
        class Opener:
            def __init__(self): self.requests=[]
            def open(self, request, timeout):
                self.requests.append(request)
                return Response(json.dumps({'shift':0,'optional':None}).encode())
        opener=Opener()
        result=fetch_cycle('synthetic-fixture',opener)
        self.assertEqual(list(result),list(ROUTES))
        for route, request in zip(ROUTES,opener.requests):
            self.assertEqual(request.full_url,BASE+'/api/'+route)
            self.assertEqual(request.get_header('X-api-key'),'synthetic-fixture')
            self.assertEqual(result[route]['shift'],0)
            self.assertIsNone(result[route]['optional'])

    def test_auth_and_rate_errors_do_not_echo_key(self):
        class Opener:
            def __init__(self, code): self.code=code
            def open(self,request,timeout):
                raise urllib.error.HTTPError(request.full_url,self.code,'fixture',{},None)
        for code in (401,403,429,503):
            with self.assertRaises(RuntimeError) as error:
                fetch_cycle('synthetic-fixture',Opener(code))
            self.assertNotIn('synthetic-fixture',str(error.exception))

    def test_redirects_and_header_injection_are_rejected(self):
        self.assertIsNone(NoRedirect().redirect_request(None,None,302,'',{},'https://other.invalid'))
        for value in ('', ' leading', 'line\nbreak', 'line\rbreak'):
            with self.assertRaises(ValueError):fetch_cycle(value)

if __name__=='__main__':unittest.main()
