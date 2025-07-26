from django.urls import path, include
from . import views


urlpatterns = [
    path('shorten/', views.ShortenURL.as_view(), name='shorten-url'),
    path('throttle-status/', views.ThrottleStatusView.as_view(), name='throttle-status'),
]
