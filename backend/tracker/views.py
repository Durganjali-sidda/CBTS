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
    IsProductManager, IsEngineeringManager, IsTeamLead,IsTeamManager, 
    IsDeveloper, IsTester, IsCustomer, CombinedPermission
)
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomLoginSerializer  # your serializer
from django_filters.rest_framework import DjangoFilterBackend


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer


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
    queryset = Bug.objects.all()
    serializer_class = BugSerializer  # ✅ Fix that was missing
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['assigned_to']  # ✅ Enables filtering by ?assigned_to=ID

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Bug.objects.none()

        role = getattr(user, 'role', None)
        queryset = Bug.objects.all()

        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to__id=assigned_to)

        if role in ['product_manager', 'engineering_manager']:
            return queryset

        if role in ['team_lead', 'team_manager']:
            return queryset.filter(team=user.team)

        if role == 'developer':
            return queryset.filter(assigned_to=user) | queryset.filter(team=user.team)

        if role in ['tester', 'customer']:
            return queryset.filter(reported_by=user)

        return Bug.objects.none()

    def get_permissions(self):
        if self.action == 'list':
            return [CombinedPermission(
                IsProductManager,
                IsEngineeringManager,
                IsTeamLead,
                IsTeamManager,
                IsDeveloper
            )]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [CombinedPermission(
                IsProductManager,
                IsEngineeringManager,
                IsTeamLead,
                IsTeamManager,
                IsDeveloper,
                IsTester
            )]
        elif self.action == 'create':
            return [CombinedPermission(
                IsTester,
                IsCustomer,
                IsProductManager,
                IsEngineeringManager,
                IsTeamManager
            )]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        assigned_to = serializer.validated_data.get('assigned_to')

        if user.role == 'customer' and assigned_to:
            raise PermissionDenied("Customers cannot assign bugs.")

        if user.role in ['team_lead', 'team_manager'] and assigned_to:
            if assigned_to.role != 'developer':
                raise PermissionDenied("Can only assign to developers.")
            if assigned_to.team != user.team:
                raise PermissionDenied("Can only assign within your team.")

        serializer.save(reported_by=user)

    def perform_update(self, serializer):
        user = self.request.user
        data = serializer.validated_data

        if user.role == 'developer':
            if set(data.keys()) - {'status'}:
                raise PermissionDenied("Developers can only update bug status.")

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
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager() | IsTeamManager()]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'product_manager' or user.is_superuser:
            return User.objects.all()

        if user.role == 'engineering_manager':
            return User.objects.exclude(role__in=['product_manager', 'engineering_manager'])

        if user.role in ['team_manager', 'team_lead']:
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

        if user.role == 'team_manager':
            # Assuming Project has a `team` field
            return Project.objects.filter(team=user.team)

        return Project.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager() | IsTeamManager()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Auto-assign the manager as the current user (Product Manager only)
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

        if user.role in ['team_lead', 'team_manager']:
            return Team.objects.filter(lead=user)

        return Team.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsEngineeringManager()]

        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsEngineeringManager() | IsTeamLead() | IsTeamManager()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(lead=self.request.user)

# ----------------------------
# User-Specific Bugs ViewSet
# ----------------------------
class UserBugsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='bugs')
    def bugs(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)

        # Role-based access: Only PM/EM or the user themselves
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
