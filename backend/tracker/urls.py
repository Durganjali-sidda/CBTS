from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BugViewSet

router = DefaultRouter()
router.register(r'bugs', BugViewSet)

urlpatterns = router.urls  # No need to nest 'api/' again
