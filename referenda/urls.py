from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static
from referendum import views


# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Home:
    url(r'^$', 'referendum.views.home', name='home'),
    url(r'^vote/(?P<poll_id>\d+)/$', views.vote, name='vote'),

    # Referendum
    url(r'^referendum/(?P<poll_id>\d+)/$', views.referendum, name='referendum'),
    url(r'^referendum/(?P<poll_id>\d+)/comment/$', views.comment, name='comment'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # Accounts login and register
    (r'^accounts/', include('allauth.urls')),

    # Profile
    url(r'^accounts/profile/$', 'referendum.views.profile', name='profile'),

    # Avatar
    (r'^avatar/', include('avatar.urls')),

     # Cookies
    url(r'cookies$', views.cookies, name='cookies')
#) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)

