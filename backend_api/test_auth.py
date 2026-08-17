import requests

url='http://127.0.0.1:8000'

try:
    r = requests.post(url+'/api/signup', json={"name":"Test User","email":"testuser@example.com","password":"Pass1234","phone":"9999999999","dob":"1990-01-01"}, timeout=10)
    print('SIGNUP', r.status_code)
    print(r.text)
except Exception as e:
    print('SIGNUP ERROR', e)

try:
    r = requests.post(url+'/api/login', json={"email":"testuser@example.com","password":"Pass1234"}, timeout=10)
    print('LOGIN', r.status_code)
    print(r.text)
except Exception as e:
    print('LOGIN ERROR', e)
