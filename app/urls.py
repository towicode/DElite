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
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include(router.urls)),
    url(r'^app/deaccount/', views.DEAccountListView.as_view(), name='app_deaccount_list'),
    url(r'^app/deaccount/create/', views.DEAccountCreateView.as_view(), name='app_deaccount_create'),
    url(r'^app/deaccount/detail/<int:pk>/', views.DEAccountDetailView.as_view(), name='app_deaccount_detail'),
    url(r'^app/deaccount/update/<int:pk>/', views.DEAccountUpdateView.as_view(), name='app_deaccount_update'),
    url(r'^app/deloggedin/', views.is_user_logged_in, name='app_is_user_logged_in'),
    url(r'^app/deinfoset/', views.user_de_info_set, name='app_user_de_info_set'),
    url(r'^app/delogin/', views.de_login, name='app_de_login'),
    url(r'^app/deinfo/', views.de_app_get_information, name='app_de_app_get_information'),
    url(r'^app/desubmit/', views.de_submit_app, name='app_de_submit_app'),
    url(r'^app/deappsearch/', views.de_apps_search, name='app_de_apps_search'),
    url(r'^app/', views.load_SPA, name='load_SPA'),

    

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



