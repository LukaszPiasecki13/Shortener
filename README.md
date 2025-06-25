# URL Shortener

This project was created as a recruitment task for the company **Szkoła w Chmurze**. This project provides a simple REST API for generating short links for given URLs. The backend is built with Django and Django REST Framework, using SQLite as the database.

I decided that the visual layer is not necessary. 
- I could do it like in classic Django using templates 
- or using frontend frameworks. 

I decided that in this case, such functionality is enough.

## Requirements

- Python 3.12+
- Django 5.2.3
- djangorestframework 3.16.0

All dependencies are listed in [`requirements.txt`](requirements.txt).


## Usage
To start the Django development server:
   ```sh
   python manage.py runserver
   ```

## API

### POST `/api/shorten/`

Creates a shortened URL from the given long address.

**Request (JSON):**
```json
{
  "original_url": "https://www.google.com/"
}
```

Example response:
```json

{
"original_url": "https://www.google.com/",
"shortened_url": "http://127.0.0.1:8000/qNzwq8"
}
```

### GET `/api/shorten/`
Returns the original URL from a shortened one.

Example request:

```swift
GET /api/shorten/?shortened_url=http://127.0.0.1:8000/qNzwq8
```   
Example response:

```json
{
"original_url": "https://www.google.com/",
"shortened_url": "http://127.0.0.1:8000/qNzwq8"
}
