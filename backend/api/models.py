from django.db import models

class ShortenedURL(models.Model):
    original_url = models.URLField(max_length=2000)
    shortened_url = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

