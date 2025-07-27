"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.wsgi import get_wsgi_application

settings_module = 'core.settings.prod' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'core.settings.dev'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)


application = get_wsgi_application()
