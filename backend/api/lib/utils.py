import random
import string

from urllib.parse import urlparse
from ..models import ShortenedURL


def create_shorten_url(url: str, prefix: str) -> str:
    '''Create a shortened URL for the given original URL.'''

    for i in range(62*6 -1):
        random_code = generate_random_short_code(length=6)
        shortened_url = f"{prefix}{random_code}"
        if not ShortenedURL.objects.filter(shortened_url=shortened_url).exists():
            ShortenedURL.objects.create(original_url=url, shortened_url=shortened_url)
            return shortened_url

    raise Exception("No possible short_url in pool")


def generate_random_short_code(length: int = 6) -> str:
    '''Generate a random short code of specified length.'''

    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))


