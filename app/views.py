from django.views.generic import DetailView, ListView, UpdateView, CreateView
from .models import DEAccount
from .forms import DEAccountForm
from django.http import JsonResponse
from django.http import HttpResponse

from app.models import DEAccount
from datetime import datetime
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render
import json
import requests
import random
import string
import os
import subprocess
from os import listdir
from os.path import isfile, join
import logging


def load_SPA(request):
    """ simple view to render our HTML"""
    return render(request, 'blank.html', None)

def is_user_logged_in(request):
    """ returns if the user is logged into the django system, NOT the DE system"""

    print (request)

    data = {"response":False}
    if request.user.is_authenticated:
        data = {"response":True}    

    return JsonResponse(data)

def user_de_info_set(request):
    """ returns if the user has their token set for DE usage 
    
    """

    username = None
    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            if (acc.DEToken and (acc.DETokenDate > timezone.now() )):
                return HttpResponse(status=200)
        except:
            pass

    return HttpResponse(status=400)

def de_login(request):
    """
    Logs into the DE via the Terrain API, stores that Token in the
    Django Model associated with the current user 
    
    
    params:
    deusername -> string
    depassword -> string
    """

    if request.method == "POST":

        form_data = json.loads(request.body.decode())

        
        deusername = form_data['deusername']
        depassword = form_data['depassword']

        username = None
        if request.user.is_authenticated:
            username = request.user.username
            try:
                accs = DEAccount.objects.filter(djangouser__username=username)

                if (len(accs)) >= 1:

                    acc = accs.first()

                    if (acc.DEToken and (acc.DETokenDate > timezone.now() )):
                        print ("valid token")
                        return HttpResponse(status=200)
                    
                    else:
                        acc.delete()

                acc = DEAccount(djangouser=request.user)

                r = requests.get("https://de.cyverse.org/terrain/token", auth=(deusername, depassword))
                r.raise_for_status()
                token = r.json()['access_token']
                time = int(r.json()['expires_in'])

                acc.DEToken = token
                acc.DETokenDate = timezone.now() + timedelta(seconds=time) 
                
                acc.save()

            except Exception as e:
                print(type(e))
                print(str(e))

        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)


def de_apps_search(request):
    """
    search for a specific app on the de

    params:
    searchterm -> string searchterm
    """

    searchterm = request.GET['searchterm']

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

    return HttpResponse(status=400)

def de_app_get_information(request):
    """ gets information about the selected app,
    including what parameters need to be fiolled in by the user
    returns this data to the front end. Params come from the
    search function.

    params:
    system_id -> system_id of app
    app_id -> app_id of app
    """

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

    return HttpResponse(status=400)  


def de_file_list(request):
    """ returns the files and folders at the specified path,
    has additional arguments to modify how data is presented (for treeview)

    params:
    path -> path to get files and folders at
    tree -> boolean to return in tree form
    listchildren -> boolean to only list the children in an array instead of an object
    """

    path = request.GET.get('path', None)
    tree = request.GET.get('tree', False)
    listchildren = request.GET.get('listchildren', False)

    
    if path is None:
        print ("NO path in de_file_list")
        return HttpResponse(status=400)

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

            if (not tree):
                return JsonResponse(r.json())

            children = []
            for m in r.json()['folders']:
                children.append({"text": m['label'], "id": m['label'], "children":  True})
            
            for n in r.json()['files']:
                children.append({"text": n['label'], "id": n['label'], "children":  False, "icon": "file"})


            if listchildren:
                treedata = children

            else :
                treedata = {
                    'id': r.json()['label'],
                    'text' : r.json()['label'],
                    'children' : children
                }
            return JsonResponse(treedata, safe=False)

        except Exception as e:
            print (str(e))
            print ("There was an exception")
            pass

    return HttpResponse(status=400)

def de_submit_app(request):
    """ Submits the app with data to the DE

    params:
    system_id -> system_id of app
    app_id -> app id of app
    config -> a multi-part dict containing all params for relevant app
    username -> DE Username (used to determine where to store the files)
    """

    if request.method == "POST":


        form_data = json.loads(request.body.decode())
        system_id = form_data['system_id']
        app_id = form_data['app_id']
        config = form_data['config']
        username = form_data['username']

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
                print ("1")
                auth_headers = {"Authorization": "Bearer " + acc.DEToken}
                print ("2")
                r = requests.post("https://de.cyverse.org/terrain/analyses", headers=auth_headers, json=request_body)
                print ("3")
                print (r.content)
                r.raise_for_status()
                print ("4")
                return JsonResponse(r.json())

            except:
                print ("testing here")
                pass

    return HttpResponse(status=400)


def de_get_local_files(request):
    """ Returns a list of all folders and files in the local directory """

    username = None

    if request.user.is_authenticated:
        username = request.user.username
        try:
            acc = DEAccount.objects.get(djangouser__username=username)
            onlyfiles = [f for f in listdir("media") if isfile(join("media", f))]
            return JsonResponse(onlyfiles, safe=False)

        except Exception as e:
            print (str(e))
            print ("There was an exception")
            pass

    return HttpResponse(status=400)



def de_create_ticket(request):
    """ Creates a ticket to the provided path
    also, downloads that ticket to the local file storage

    Params:
    path -> Irods path to the requested file
    """

    if request.method == "POST":

        form_data = json.loads(request.body.decode())
        path = form_data['path']

        request_body = {
            "paths" : [
                path,
            ]
        }

        request_body = json.dumps(request_body)

        print(request_body)

        username = None
        if request.user.is_authenticated:
            username = request.user.username
            try:
                acc = DEAccount.objects.get(djangouser__username=username)
                auth_headers = {"Authorization": "Bearer " + acc.DEToken}
                r = requests.post("https://de.cyverse.org/terrain/secured/filesystem/tickets?public=0", headers=auth_headers, data=request_body)
                r.raise_for_status()
                ticketdata = r.json()
                ticket = ticketdata['tickets'][0]['ticket-id']
                path = ticketdata['tickets'][0]['path']
                print(ticket + " " + path)

                # This command could have multiple commands separated by a new line \n
                some_command = 'iget -t '+ticket+" '"+path+"' media"

                p = subprocess.Popen(some_command, stdout=subprocess.PIPE, shell=True)

                (output, err) = p.communicate()  

                #This makes the wait possible
                p_status = p.wait()

                #This will give you the output of the command being executed
                print ("Command output: " + str(output))

                return JsonResponse(r.json())

            except Exception as e:
                print(type(e))
                print(str(e))
                print (e.response.text)

    return HttpResponse(status=400)


def de_upload_file(request):
    """ uploads a local file to the DE using the 
    Terrain upload api
    

    Params:
    path -> Irods path to upload the file
    file -> name of the file

    """
    data = {"response":False}

    if request.method == "POST":

        form_data = json.loads(request.body.decode())
        path = form_data['path']
        myfile = form_data['file']

        # request_body = json.dumps(request_body)

        # print(request_body)

        username = None
        if request.user.is_authenticated:
            username = request.user.username
            try:
                acc = DEAccount.objects.get(djangouser__username=username)
                auth_headers = {"Authorization": "Bearer " + acc.DEToken}
                print ("Bearer " + acc.DEToken)
                files = {'file': open("media" + os.path.sep + myfile, 'rb')}

                r = requests.post("https://de.cyverse.org/terrain/secured/fileio/upload?dest="+path, files=files, headers=auth_headers)
                r.raise_for_status()

                return JsonResponse(r.json())

            except Exception as e:
                print(type(e))
                print(str(e))
                print (e.response.text)

    # small bug, this should return 400, but the above code is
    # working but returing an exception for some reason
    # TODO look into this later.
    return HttpResponse(status=200)







    

    

