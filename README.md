# URL Shortener

This project provides a simple REST API for generating short links for given URLs, as well as a modern React frontend for user interaction. The backend is built with Django and Django REST Framework, using SQLite as the database for development.

## Features

- Shorten long URLs to short, shareable links
- Retrieve the original URL from a shortened one
- Rate limiting (throttling) per IP address
- Modern React frontend with Ant Design components
- API status and usage feedback in the frontend

## Requirements

- Python 3.12+
- Django 5.2.3
- djangorestframework 3.16.0
- Node.js 18+ (for frontend)
- Redis (for throttling in development)

All backend dependencies are listed in [`backend/requirements.txt`](backend/requirements.txt).  
Frontend dependencies are managed via [`frontend/package.json`](frontend/package.json).

## Usage

### Backend

Install dependencies and run migrations:
```sh
cd backend
pip install -r requirements.txt
python manage.py migrate
```

Start the Django development server:
```sh
python manage.py runserver
```

### Frontend

Install dependencies and start the development server:
```sh
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173) by default.

## API

### POST `/shorten/`

Creates a shortened URL from the given long address.

**Request (JSON):**
```json
{
  "original_url": "https://www.google.com/"
}
```

**Example response:**
```json
{
  "original_url": "https://www.google.com/",
  "shortened_url": "http://127.0.0.1:8000/qNzwq8"
}
```

### GET `/shorten/?shortened_url=<short_url>`

Returns the original URL from a shortened one.

**Example request:**
```
GET /shorten/?shortened_url=http://127.0.0.1:8000/qNzwq8
```

**Example response:**
```json
{
  "original_url": "https://www.google.com/",
  "shortened_url": "http://127.0.0.1:8000/qNzwq8"
}
```

### GET `/throttle-status/`

Returns the current API rate limit status for the requesting IP.

**Example response:**
```json
{
  "rate": "20/minute",
  "limit": 20,
  "remaining": 15,
  "reset_in_seconds": 45
}
```

## Project Structure

- [`backend/`](backend/) - Django REST API backend
- [`frontend/`](frontend/) - React + Vite frontend

## Notes

- The backend uses Redis for request throttling in development. Make sure Redis is running locally or update the cache settings in [`backend/core/settings/base.py`](backend/core/settings/base.py).
- For production, environment variables and settings in [`backend/core/settings/prod.py`](backend/core/settings/prod.py) should be configured accordingly.
- The frontend communicates with the backend via the API base URL, which can be changed in [`frontend/src/App.jsx`](frontend/src/App.jsx).

---
**Author:** [Lukasz Piasecki](https://github.com/LukaszPiasecki13)