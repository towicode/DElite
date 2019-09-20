from django.views.generic import DetailView, ListView, UpdateView, CreateView
from .models import DEAccount
from .forms import DEAccountForm
from django.http import JsonResponse
from app.models import DEAccount
from datetime import datetime
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render
import json
import requests
import random
import string


class DEAccountListView(ListView):
    model = DEAccount

class DEAccountCreateView(CreateView):
    model = DEAccount
    form_class = DEAccountForm

class DEAccountDetailView(DetailView):
    model = DEAccount

class DEAccountUpdateView(UpdateView):
    model = DEAccount
    form_class = DEAccountForm

def load_SPA(request):
    return render(request, 'blank.html', None)

def is_user_logged_in(request):

    print (request)

    data = {"response":False}
    if request.user.is_authenticated:
        data = {"response":True}    

    return JsonResponse(data)

def user_de_info_set(request):

    data = {"response":False}
    username = None
    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            if (acc.DEToken and (acc.DETokenDate > timezone.now() )):
                data = {"response": True}
        except:
            pass

    return JsonResponse(data)

def de_login(request):

    if request.method == "POST":

        form_data = json.loads(request.body.decode())

        
        deusername = form_data['deusername']
        depassword = form_data['depassword']

        data = {"response": False}
        username = None
        if request.user.is_authenticated:
            username = request.user.username
            try:
                accs = DEAccount.objects.filter(djangouser__username=username)

                if (len(accs)) >= 1:

                    acc = accs.first()

                    if (acc.DEToken and (acc.DETokenDate > timezone.now() )):
                        data = {"response": True}
                        print ("valid token")
                        return JsonResponse(data)
                    
                    else:
                        accs.delete()

                acc = DEAccount(djangouser=request.user)

                r = requests.get("https://de.cyverse.org/terrain/token", auth=(deusername, depassword))
                r.raise_for_status()
                token = r.json()['access_token']
                time = int(r.json()['expires_in'])

                acc.DEToken = token
                acc.DETokenDate = timezone.now() + timedelta(seconds=time) 
                
                acc.save()

                data = {"response": True}
            except Exception as e:
                print(type(e))
                print(str(e))

        # just return a JsonResponse
        return JsonResponse(data)

    else:
        return JsonResponse({"repsonse": False})


def de_apps_search(request):
    data = {"response":False}

    searchterm = request.GET['searchterm']

    print (searchterm)

    username = None
    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            query_params = {"search": searchterm}
            auth_headers = {"Authorization": "Bearer " + acc.DEToken}
            r = requests.get("https://de.cyverse.org/terrain/apps", headers=auth_headers, params=query_params)
            r.raise_for_status()
            return JsonResponse(r.json())
        except:
            pass

    return JsonResponse(data)

def de_app_get_information(request):
    data = {"response":False}

    system_id = request.GET['system_id']
    app_id = request.GET['app_id']

    username = None
    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            url = "https://de.cyverse.org/terrain/apps/{0}/{1}".format(system_id, app_id)
            auth_headers = {"Authorization": "Bearer " + acc.DEToken}
            r = requests.get(url, headers=auth_headers)
            r.raise_for_status()
            return JsonResponse(r.json())
        except:
            pass

    return JsonResponse(data)

def de_file_list(request):
    data = {"response":False}
    path = request.GET.get('path', None)

    
    if path is None:
        print ("NO path in de_file_list")
        return jsonResponse(data)

    query_params = {"path": path, "limit": 100, "offset": 0}


    username = None


    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            url = "https://de.cyverse.org/terrain/secured/filesystem/paged-directory"
            auth_headers = {"Authorization": "Bearer " + acc.DEToken}
            r = requests.get(url, headers=auth_headers, params=query_params)
            r.raise_for_status()
            return JsonResponse(r.json())
        except Exception as e:
            print (str(e))
            print ("There was an exception")
            pass

    return JsonResponse(data)

def de_submit_app(request):
    data = {"response":False}

    if request.method == "POST":


        print("aaa")
        form_data = json.loads(request.body.decode())
        print("bbb")
        system_id = form_data['system_id']
        app_id = form_data['app_id']
        config = form_data['config']
        username = form_data['username']

        print(config)

        letters = string.ascii_lowercase
        m=''.join(random.choice(letters) for i in range(15))

        request_body = {
            "name": "delite_app__"+m,
            "app_id": app_id,
            "system_id": system_id,
            "debug": False,
            "output_dir": "/iplant/home/" + username + "/analyses",
            "notify": True
        }
        request_body['config'] = config

        username = None
        if request.user.is_authenticated:
            username = request.user.username
            try:
                acc = DEAccount.objects.get(djangouser__username=username)
                auth_headers = {"Authorization": "Bearer " + acc.DEToken}
                r = requests.post("https://de.cyverse.org/terrain/analyses", headers=auth_headers, json=request_body)
                r.raise_for_status()
                return JsonResponse(r.json())

            except:
                pass

    return JsonResponse(data)






    

    

