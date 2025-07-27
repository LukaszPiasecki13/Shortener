/set -o errexit

pip install -r ./backend/requirements.txt
pip3 install django
pip install dj-database-url
pip install djangorestframework
pip install django-cors-headers
pip install gunicorn
pip install uvicorn


python manage.py collectstatic --no-input

python manage.py migrate
