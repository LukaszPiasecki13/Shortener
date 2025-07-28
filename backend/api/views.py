from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
import time
from django.core.cache import cache

from .lib.utils import create_shorten_url
from .serializers import ShortenURLSerializer
from .models import ShortenedURL
from .throttling import RealIPAnonRateThrottle


class ShortenURL(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request) -> Response:
        """
        Shorten a given URL.
        """
        serializer = ShortenURLSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        original_url = serializer.validated_data['original_url']
        prefix = request.build_absolute_uri('/')
        shortened_url = create_shorten_url(original_url, prefix)

        return Response(
            {
                'original_url': original_url,
                'shortened_url': shortened_url,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request) -> Response:
        """
        Retrieve the original URL from a shortened URL.
        """
        shortened_url = request.query_params.get('shortened_url')
        if not shortened_url:
            return Response(
                {'error': 'Missing "shortened_url" query parameter.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        shortened_url_obj = get_object_or_404(
            ShortenedURL, shortened_url=shortened_url)
        return Response(
            {
                'original_url': shortened_url_obj.original_url,
                'shortened_url': shortened_url_obj.shortened_url,
            }
        )


class ThrottleStatusView(APIView):
    

    def get(self, request):

        throttle = RealIPAnonRateThrottle()
        throttle.parse_rate(throttle.rate)

        cache_key = throttle.get_cache_key(request, self)
        if cache_key is None:
            return Response({'detail': 'Throttle not applicable'}, status=status.HTTP_200_OK)

        history = cache.get(cache_key)
        now = time.time()
        duration = throttle.duration  
        print(f"Cache key: {cache_key}, history: {history}")

        if history is None or len(history) == 0:
            remaining = throttle.num_requests
            reset_in = duration  
        else:
            remaining = max(0, throttle.num_requests - len(history))
            earliest = min(history)
            reset_in = max(0, earliest + duration - now)

        return Response({
            'rate': throttle.rate,
            'limit': throttle.num_requests,
            'remaining': remaining,
            'reset_in_seconds': int(reset_in),
        })

class RedirectShortURLView(APIView):
    def get(self, request, short_code):
        if request.build_absolute_uri()[-1] == '/': 
            shortened_url = request.build_absolute_uri()[:-1] 
        else:
            shortened_url = request.build_absolute_uri()
        shortened_url_obj = get_object_or_404(ShortenedURL, shortened_url=shortened_url)
        
        return Response({
            'original_url': shortened_url_obj.original_url,
            'shortened_url': shortened_url_obj.shortened_url,
        })
    

