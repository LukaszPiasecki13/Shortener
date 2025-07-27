/set -o errexit

pip install -r ./requirements.txt
pip install dj-database-url
pip3 install django
pip install djangorestframework
pip install django-cors-headers
pip install psycopg2-binary
pip install gunicorn
pip install uvicorn



python manage.py collectstatic --no-input

python manage.py migrate
