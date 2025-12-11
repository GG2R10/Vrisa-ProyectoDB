
import urllib.request
import urllib.error
import json

url = 'http://localhost:8000/ciudadanos/'
print(f"Requesting {url}...")

try:
    with urllib.request.urlopen(url) as response:
        print(f"Status: {response.status}")
        data = response.read().decode('utf-8')
        try:
            json_data = json.loads(data)
            print(f"Data count: {len(json_data)}")
            print("Response is valid JSON")
            print(data[:200]) # Print first 200 chars
        except json.JSONDecodeError:
            print("Response is NOT JSON")
            print(data[:200])
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} - {e.reason}")
    print(e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URLError: {e.reason}")
except Exception as e:
    print(f"Error: {e}")
