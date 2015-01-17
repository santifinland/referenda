from django.conf.urls import patterns, include, url
from django.contrib import admin
from referendum import views


admin.autodiscover()


urlpatterns = patterns('',
    # Home:
    url(r'^$', 'referendum.views.home', name='home'),
    url(r'^polls/country/(?P<institution>[ \w-]+)/$', 'referendum.views.home', name='home_country'),
    url(r'^polls/region/(?P<institution>[ \w-]+)/$', 'referendum.views.home', name='home_region'),
    url(r'^polls/city/(?P<institution>[ \w-]+)/$', 'referendum.views.home', name='home_city'),
    url(r'^vote/(?P<poll_id>\d+)/$', views.vote, name='vote'),

    # Referendum
    url(r'^referendum/(?P<poll_slug>[\w-]+)/$', views.referendum, name='referendum'),
    url(r'^referendum/(?P<poll_slug>[\w-]+)/comment/$', views.comment, name='comment'),

    # Results
    url(r'^results$', views.results, name='results'),
    url(r'^results/country/(?P<institution>[ \w-]+)/$', 'referendum.views.results', name='results_country'),
    url(r'^results/region/(?P<institution>[ \w-]+)/$', 'referendum.views.results', name='results_region'),
    url(r'^results/city/(?P<institution>[ \w-]+)/$', 'referendum.views.results', name='results_city'),

    # Delegate Vode
    url(r'^delegatevote$', views.delegatevote, name='delegatevote'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    #url(r'^admin/', include(admin.site.urls)),

    # Accounts login and register
    (r'^accounts/', include('allauth.urls')),

    # Profile
    url(r'^accounts/avatar/$', 'referendum.views.avatar', name='avatar'),
    url(r'^accounts/location$', 'referendum.views.location', name='location'),
    url(r'^accounts/location/region$', 'referendum.views.region', name='region'),
    url(r'^accounts/location/city$', 'referendum.views.city', name='city'),
    url(r'^accounts/lawtier$', 'referendum.views.lawtier', name='lawtier'),
    url(r'^accounts/profile/$', 'referendum.views.profile', name='profile'),
    url(r'^accounts/delete/$', 'referendum.views.delete', name='delete'),
    url(r'^accounts/delete/thanks$', 'referendum.views.delete_thanks', name='delete_thanks'),

    # Avatar
    (r'^avatar/', include('avatar.urls')),

    # Data protection
    url(r'dataprotection$', views.dataprotection, name='dataprotection'),

     # Cookies
    url(r'cookies$', views.cookies, name='cookies')
#) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)

