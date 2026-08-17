import requests
try:
    r=requests.get('http://127.0.0.1:8000', timeout=5)
    print('PING', r.status_code, r.text)
except Exception as e:
    print('PING ERROR', e)
