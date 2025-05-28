# tracker/views.py
from rest_framework import viewsets
from .models import Bug
from .serializers import BugSerializer
from rest_framework.permissions import IsAuthenticated

class BugViewSet(viewsets.ModelViewSet):
    queryset = Bug.objects.all()
    serializer_class = BugSerializer
    permission_classes = [IsAuthenticated] 
