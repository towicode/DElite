import unittest
from django.urls import reverse
from django.test import Client
from .models import DEAccount
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType


def create_django_contrib_auth_models_user(**kwargs):
    defaults = {}
    defaults["username"] = "username"
    defaults["email"] = "username@tempurl.com"
    defaults.update(**kwargs)
    return User.objects.create(**defaults)


def create_django_contrib_auth_models_group(**kwargs):
    defaults = {}
    defaults["name"] = "group"
    defaults.update(**kwargs)
    return Group.objects.create(**defaults)


def create_django_contrib_contenttypes_models_contenttype(**kwargs):
    defaults = {}
    defaults.update(**kwargs)
    return ContentType.objects.create(**defaults)


def create_deaccount(**kwargs):
    defaults = {}
    defaults["DEusername"] = "DEusername"
    defaults["DEpassword"] = "DEpassword"
    defaults["DEToken"] = "DEToken"
    defaults["DETokenDate"] = "DETokenDate"
    defaults.update(**kwargs)
    if "djangouser" not in defaults:
        defaults["djangouser"] = create_django_contrib_auth_models_user()
    return DEAccount.objects.create(**defaults)


class DEAccountViewTest(unittest.TestCase):
    '''
    Tests for DEAccount
    '''
    def setUp(self):
        self.client = Client()

    def test_list_deaccount(self):
        url = reverse('app_deaccount_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_deaccount(self):
        url = reverse('app_deaccount_create')
        data = {
            "DEusername": "DEusername",
            "DEpassword": "DEpassword",
            "DEToken": "DEToken",
            "DETokenDate": "DETokenDate",
            "djangouser": create_django_contrib_auth_models_user().pk,
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 302)

    def test_detail_deaccount(self):
        deaccount = create_deaccount()
        url = reverse('app_deaccount_detail', args=[deaccount.pk,])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_deaccount(self):
        deaccount = create_deaccount()
        data = {
            "DEusername": "DEusername",
            "DEpassword": "DEpassword",
            "DEToken": "DEToken",
            "DETokenDate": "DETokenDate",
            "djangouser": create_django_contrib_auth_models_user().pk,
        }
        url = reverse('app_deaccount_update', args=[deaccount.pk,])
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)


