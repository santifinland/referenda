import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "referenda.settings")

from django.core.wsgi import get_wsgi_application
_application = get_wsgi_application()

env_variables_to_pass = ['REFERENDA_DATABASE_URL']
def application(environ, start_response):
    for var in env_variables_to_pass:
        os.environ[var] = environ.get(var, '')
    return _application(environ, start_response)
