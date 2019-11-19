IP=$(curl https://ipinfo.io/ip)

echo $IP

sed -i 's/"repl8acem3"/"'$IP'","'$IP':8000"/' app/settings.py

python3.6 manage.py runserver 0.0.0.0:8000