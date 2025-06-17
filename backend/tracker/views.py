from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action

from .models import Bug, User, Project, Team
from .serializers import BugSerializer, UserSerializer, ProjectSerializer, TeamSerializer
from .permissions import (
    IsProductManager, IsEngineeringManager, IsTeamLead,
    IsDeveloper, IsTester, IsCustomer
)


# ----------------------------
# Current Authenticated User
# ----------------------------
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ----------------------------
# Bug ViewSet
# ----------------------------
class BugViewSet(viewsets.ModelViewSet):
    serializer_class = BugSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = user.role

        if role in ['product_manager', 'engineering_manager']:
            return Bug.objects.all()

        if role == 'team_lead':
            return Bug.objects.filter(team=user.team)

        if role == 'developer':
            return Bug.objects.filter(assigned_to=user) | Bug.objects.filter(team=user.team)

        if role in ['tester', 'customer']:
            return Bug.objects.filter(reported_by=user)

        return Bug.objects.none()

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]
        
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager() |
                    IsTeamLead() | IsDeveloper() | IsTester()]

        if self.action == 'create':
            return [IsAuthenticated(), IsTester() | IsCustomer() | 
                    IsProductManager() | IsEngineeringManager()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save()


# ----------------------------
# User ViewSet
# ----------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsProductManager()]

        if self.action == 'list':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'product_manager' or user.is_superuser:
            return User.objects.all()

        if user.role == 'engineering_manager':
            return User.objects.exclude(role__in=['product_manager', 'engineering_manager'])

        if user.role == 'team_lead':
            return User.objects.filter(team=user.team)

        return User.objects.filter(id=user.id)


# ----------------------------
# Project ViewSet
# ----------------------------
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'product_manager':
            return Project.objects.filter(manager=user)

        if user.role == 'engineering_manager':
            return Project.objects.all()

        return Project.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)


# ----------------------------
# Team ViewSet
# ----------------------------
class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'engineering_manager':
            return Team.objects.all()

        if user.role == 'team_lead':
            return Team.objects.filter(lead=user)

        return Team.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsEngineeringManager()]

        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsEngineeringManager() | IsTeamLead()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(lead=self.request.user)


# ----------------------------
# User-Specific Bugs ViewSet
# ----------------------------
class UserBugsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def list_bugs(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        if request.user.role not in ['product_manager', 'engineering_manager'] and request.user != user:
            return Response({"detail": "Permission denied"}, status=403)

        bugs = Bug.objects.filter(assigned_to=user)
        serializer = BugSerializer(bugs, many=True)
        return Response(serializer.data)


# ----------------------------
# Password Reset (via Email)
# ----------------------------
class PasswordResetAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "detail": "If an account with that email exists, a reset link has been sent."
            }, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        subject = "Password Reset Requested"
        message = f"Hi {user.get_full_name() or user.email},\n\n" \
                  f"Click the link below to reset your password:\n\n{reset_url}\n\n" \
                  "If you didn’t request this, just ignore this email."

        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({
            "detail": "If an account with that email exists, a reset link has been sent."
        }, status=status.HTTP_200_OK)
