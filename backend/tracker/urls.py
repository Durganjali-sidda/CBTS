from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    BugViewSet, ProjectViewSet, TeamViewSet, UserViewSet,
    CurrentUserView, PasswordResetAPIView
)

router = DefaultRouter()
router.register(r'bugs', BugViewSet, basename='bugs')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'teams', TeamViewSet, basename='teams')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/user/', CurrentUserView.as_view()),
    path('password-reset/', PasswordResetAPIView.as_view(), name='password_reset'),
    
    # ✅ JWT Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
