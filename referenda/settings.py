"""
Django settings for referenda project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

SITE_ID = 2

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'd$85yora*btbuwf-mi0@)z360la-o*xqg5)4(h8+*unc=6bl=s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
TEMPLATE_DEBUG = False

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    #'django.template.loaders.eggs.Loader',
)

import os.path
PROJECT_DIR = os.path.dirname(__file__)  # this is not Django setting.
TEMPLATE_DIRS = (
    os.path.join("referendum/templates"),
    # here you can add another templates directory if you wish.
)

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'referendum',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
    'avatar',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
)

ROOT_URLCONF = 'referenda.urls'

WSGI_APPLICATION = 'referenda.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'referenda',
        'USER': 'psql',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# Parse database configuration from $DATABASE_URL
import dj_database_url
#DATABASES['default'] = dj_database_url.config()
#DATABASES['default'] = dj_database_url.config(default=os.environ.get('DATABASE_URL'))
DATABASES = {'default': dj_database_url.config(default='postgres://zjcqxxyskstkvy:mC1pP0VAcPGa5sUmYfTM7dfsqN@ec2-79-125-25-99.eu-west-1.compute.amazonaws.com:5432/debl6dvkif60up')}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Static asset configuration
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = 'static'
STATIC_URL = '/static/'
MEDIA_ROOT = '/Users/santifinland/referenda/media/'
MEDIA_URL = '/media/'

# all_auth
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.request",
    "allauth.account.context_processors.account",
    "allauth.socialaccount.context_processors.socialaccount",
    "django.contrib.messages.context_processors.messages",
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.static"
)

AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",

    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend"
)

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = (3)
ACCOUNT_EMAIL_REQUIRED = (False)
#ACCOUNT_EMAIL_VERIFICATION = ("mandatory")

# django-avatar
AVATAR_AUTO_GENERATE_SIZES = (50, 80, 300)
AVATAR_STORAGE_DIR = 'avatars/'
AVATAR_MAX_AVATARS_PER_USER = 1
AVATAR_HASH_FILENAMES = False
AVATAR_HASH_USERDIRNAMES = False
AVATAR_GRAVATAR_BACKUP = False


#try:
    #from local_settings import *
#except ImportError:
    #pass
