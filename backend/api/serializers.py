from rest_framework import serializers

class ShortenURLSerializer(serializers.Serializer):
    original_url = serializers.URLField()