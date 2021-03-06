from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from timeline.views import IndexView
from timeline.views import HomeView
from timeline.views import ArcsView
from timeline.views import SerialView


# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sdbm.views.home', name='home'),
    # url(r'^sdbm/', include('sdbm.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/$', include(admin.site.urls)),
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^home/$', HomeView.as_view(), name='home'),
    url(r'^arcs/$', ArcsView.as_view(), name='arcs'),
    url(r'^serial/$', SerialView.as_view(), name='serial'),
)

urlpatterns += staticfiles_urlpatterns()
