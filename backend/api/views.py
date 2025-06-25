from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .lib.utils import create_shorten_url
from .serializers import ShortenURLSerializer
from .models import ShortenedURL

class ShortenURL(APIView):

    def post(self, request):
        '''Shorten a given URL'''
        
        serializer = ShortenURLSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=400)
        else:
            url = serializer.validated_data.get('original_url')
            prefix = request.build_absolute_uri('/')
            shortened_url = create_shorten_url(url, prefix)

            return Response({
                'original_url': url,
                'shortened_url': shortened_url
        })

    def get(self, request):
        '''Retrieve the original URL from a shortened URL'''

        shortened_url = request.query_params.get('shortened_url', None)
        try:
            shortened_url_obj = ShortenedURL.objects.get(shortened_url=shortened_url)
            return Response({
                'original_url': shortened_url_obj.original_url,
                'shortened_url': shortened_url_obj.shortened_url
            })
        except ShortenedURL.DoesNotExist:
            return Response({'error': 'Shortened URL not found'}, status=404)