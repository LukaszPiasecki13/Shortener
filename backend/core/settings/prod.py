import os
from .base import *
import dj_database_url

DEBUG = os.environ.get('DEBUG', default=False)
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME')]
CSRF_TRUSTED_ORIGINS = ['https://' +
                        os.environ.get('RENDER_EXTERNAL_HOSTNAME')]

STORAGES = {
    "default": {
        "BECKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
}

REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/hour',
    }
}