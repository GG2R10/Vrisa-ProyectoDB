# Local development settings
from .settings import *

# Use SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Disable some security features for development
DEBUG = True
ALLOWED_HOSTS = ['*']
