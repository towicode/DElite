<a href="https://cyverse.org/">
    <img src="https://de.cyverse.org/cyverse_logo.png" alt="cyverse logo" title="cyverse" align="right" height="50" />
</a>

Cyverse DElite
======================
:star: Star us on GitHub — it helps!

Cyverse DElite is a demonstration of Django combined with the Discovery Environment.
It is a useful resource to anyone looking to use the Discovery Environment API in their own
django/python project. The backend is coded in Python/Django, the front-end is coded in modern javascript.
The aim of this project is to mock elements of the real Discovery Environment, hence the name, DElite.


## Table of content

- [Installation](#installation)
    - [Docker](#docker)
    - [Normal](#normal)
- [Features](#features)
    - [Exploring Files](#tree-view)
    - [Transfering Files](#transfer-view)
    - [Running Apps](#running-apps)
- [License](#license)
- [Links](#links)

## Installation

There are two ways to run Cyverse DElite:

- Docker (Any platform that supports docker)
- Normal (Only tested on Ubuntu 18.04)

### Docker

Our docker image is build on `Docker version 19.03.2-rc1, build 8296f90eef` However, it may work on earlier versions.
The recommended instructions for usage is

1. Build the docker image

```
docker build . --tag="delite"
```

2. Run the image, with ports exposed, in interactive mode

```
docker run -it -p 8000:8000 delite
```

3. Login to the admin interface by visiting `localhost:8000/admin` the username:password is `admin:admin`

4. visit the app at `localhost:8000`

### Normal

DElite has the following system requirements.

* Python 3.6
* pip
* ICommands  [Setting up iCommands](https://wiki.cyverse.org/wiki/display/DS/Setting+Up+iCommands)


Clone down this project, consider starting a virtual environment [virtualenv-tutorial](https://docs.python-guide.org/dev/virtualenvs/)


Install all python requirements

`pip install -r requirements.py`

Migrate the database

`python manage.py migrate`

Create your user account

`python manage.py createsuperuser`

Run the server & login to the admin interface

1. `python manage.py runserver`
2. http://localhost:8000/admin


open the app

`http://localhost:8000`


## Features

### tree-view

The tree-view allows you to explore any files you currently have on the File Storage.

![tree-picture](https://i.imgur.com/UESjlLS.gif)


### transfer-view

The transfer-view allows you to transfer files between the File Storage and your Django Server via iRODS tickets.
![transfer-picture](https://i.imgur.com/jKJsTas.png)


### running-apps
Run any app on the DE, results will be stored in your filestorage!
![app1](https://i.imgur.com/1DaQMap.png)
![app2](https://i.imgur.com/3qKwe2S.png)

## Other features
DElite allows you to Log-in and store your DE token within the django modeling system, in addition allows you to manage users via the django admin system.
![app3](https://i.imgur.com/VvYSxnE.jpg)


## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

## Links

* [Cyverse](https://cyverse.org/)
* [iRODS](https://irods.org/)
* [Django](https://www.djangoproject.com/)

