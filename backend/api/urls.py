from django.urls import path, include
from . import views


urlpatterns = [
    path('shorten/', views.ShortenURL.as_view(), name='shorten-url'),
    path('throttle-status/', views.ThrottleStatusView.as_view(), name='throttle-status'),
    path('<str:short_code>/', views.RedirectShortURLView.as_view(), name='redirect_short_url'),
]
