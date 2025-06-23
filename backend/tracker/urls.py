from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    BugViewSet, ProjectViewSet, TeamViewSet, UserViewSet,
    CurrentUserView, PasswordResetAPIView, CustomTokenObtainPairView
)

# ✅ Router-based ViewSets (REST API endpoints)
router = DefaultRouter()
router.register(r'bugs', BugViewSet, basename='bugs')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'teams', TeamViewSet, basename='teams')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),

    # ✅ Authenticated user info
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),

    # ✅ Password reset
    path('password-reset/', PasswordResetAPIView.as_view(), name='password_reset'),

    # ✅ JWT authentication endpoints (login & refresh)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # custom login serializer
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
