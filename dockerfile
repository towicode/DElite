## Basic Dockerfile to run DElite Django
FROM ubuntu:16.04

# First we install python
RUN apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN apt-get install -y git

RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel


# Next we set up our work environment
WORKDIR /usr/local

COPY requirements.txt .

# install irods and then setup
COPY irods.deb .
RUN apt-get install libfuse2 -y
RUN dpkg -i irods.deb

RUN printf 'data.cyverse.org\n1247\nanonymous\niplant' | iinit

# setup django
RUN python3.6 -m pip install -r requirements.txt

# copy app files
COPY app app
COPY media media
COPY manage.py .

# setup database
RUN python3.6 manage.py migrate

# create admin user
RUN echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@admin.com', 'admin')" | python3.6 manage.py shell

# run server
CMD [ "python3.6", "manage.py", "runserver", "0.0.0.0:8000" ]
