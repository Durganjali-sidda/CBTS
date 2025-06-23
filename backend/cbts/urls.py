# cbts/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# ✅ Root welcome view for base URL
def api_root(request):
    return JsonResponse({"message": "Welcome to the CBTS API. Use /api/ for access."})

urlpatterns = [
    path('', api_root),  # Root API message
    path('admin/', admin.site.urls),  # Django admin
    path('api/', include('tracker.urls')),  # Core API (bugs, users, teams, etc.)
    path('api/auth/', include('dj_rest_auth.urls')),  # dj-rest-auth login/logout/password flows
]
