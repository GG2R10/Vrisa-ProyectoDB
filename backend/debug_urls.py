
import os
import django
from django.conf import settings
from django.urls import resolve, get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

path = '/ciudadanos/'
print(f"Testing resolution for path: {path}")

try:
    match = resolve(path)
    print(f"Match found: {match}")
    print(f"View: {match.func}")
    print(f"URL Name: {match.url_name}")
except Exception as e:
    print(f"Error resolving path: {e}")

print("\nListing all patterns:")
resolver = get_resolver()
for p in resolver.url_patterns:
    print(p)
