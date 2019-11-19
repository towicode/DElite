from django.urls import path, include
from rest_framework import routers
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url




from . import api
from . import views

router = routers.DefaultRouter()
router.register(r'deaccount', api.DEAccountViewSet)


urlpatterns = [
    url(r'^admin/?', admin.site.urls),
    url(r'^api/v1/?', include(router.urls)),
    url(r'^deloggedin/?', views.is_user_logged_in, name='app_is_user_logged_in'),
    url(r'^deinfoset/?', views.user_de_info_set, name='app_user_de_info_set'),
    url(r'^delogin/?', views.de_login, name='app_de_login'),
    url(r'^deinfo/?', views.de_app_get_information, name='app_de_app_get_information'),
    url(r'^desubmit/?', views.de_submit_app, name='app_de_submit_app'),
    url(r'^deappsearch/?', views.de_apps_search, name='app_de_apps_search'),
    url(r'^defiles/?', views.de_file_list, name='app_de_file_list'),
    url(r'^localfiles/?', views.de_get_local_files, name='de_get_local_files'),
    url(r'^deticket/?', views.de_create_ticket, name='de_create_ticket'),
    url(r'^deupload/?', views.de_upload_file, name='de_upload_file'),
    url(r'', views.load_SPA, name='load_SPA'),

    

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



