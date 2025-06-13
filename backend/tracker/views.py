# tracker/views.py
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import action
from .models import Bug, User, Project, Team
from .serializers import BugSerializer, UserSerializer, ProjectSerializer, TeamSerializer
from .permissions import (
    IsProductManager,
    IsEngineeringManager,
    IsTeamLead,
    IsDeveloper,
    IsTester,
    IsCustomer,
)



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# ----------------------------
# BugViewSet
# ----------------------------
# Handles creating, listing, retrieving, updating, and deleting Bug instances.
class BugViewSet(viewsets.ModelViewSet):
    queryset = Bug.objects.all()
    serializer_class = BugSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in for any action

    def get_queryset(self):
        """
        Filter bugs based on the role of the requesting user:
        - Product Manager: Bugs from projects they manage.
        - Engineering Manager: All bugs in the system.
        - Team Lead: Bugs assigned to their team.
        - Developer: Bugs assigned to themselves.
        - Tester/Customer: Bugs they reported.
        """
        user = self.request.user

        if user.role == 'product_manager':
            return Bug.objects.filter(project__manager=user)

        if user.role == 'engineering_manager':
            return Bug.objects.all()

        if user.role == 'team_lead':
            return Bug.objects.filter(team=user.team)

        if user.role == 'developer':
            return Bug.objects.filter(assigned_to=user)

        if user.role in ['tester', 'customer']:
            return Bug.objects.filter(reported_by=user)

        # Fallback: no access
        return Bug.objects.none()

    def get_permissions(self):
        """
        Return different permission classes based on the action:
        - list: Only Product/Engineering Managers can list all bugs.
        - retrieve/update/partial_update/destroy: 
            Product/Engineering Managers, Team Leads, Developers, and Testers can access.
        - create: Testers, Customers, Product/Engineering Managers can create new bugs.
        """
        user = self.request.user

        if self.action == 'list':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [
                IsAuthenticated(),
                IsProductManager() | 
                IsEngineeringManager() | 
                IsTeamLead() | 
                IsDeveloper() | 
                IsTester()
            ]

        if self.action == 'create':
            return [
                IsAuthenticated(),
                IsTester() | 
                IsCustomer() | 
                IsProductManager() | 
                IsEngineeringManager()
            ]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """
        When a bug is created, automatically set the 'reported_by' field
        to the currently authenticated user.
        """
        serializer.save(reported_by=self.request.user)

    def perform_update(self, serializer):
        """
        Save updates normally. The BugSerializer itself restricts which fields
        can be updated based on the user's role (developer vs team_lead).
        """
        serializer.save()


# ----------------------------
# UserViewSet
# ----------------------------
# Manages User instances (list, create, retrieve, update, delete).
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in for any action

    def get_permissions(self):
        """
        - create: Only Product Managers can create new users.
        - list: Product Managers and Engineering Managers can list users.
        - retrieve/update/partial_update/destroy: Any authenticated user,
          but queryset filtering further restricts visibility.
        """
        if self.action == 'create':
            return [IsAuthenticated(), IsProductManager()]

        if self.action == 'list':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Filter users based on the requesting user's role:
        - Product Manager / superuser: All users.
        - Engineering Manager: All except other managers and engineering managers.
        - Team Lead: Only users in their own team.
        - Developer, Tester, Customer: Only their own user record.
        """
        user = self.request.user

        if user.role == 'product_manager' or user.is_superuser:
            return User.objects.all()

        if user.role == 'engineering_manager':
            return User.objects.exclude(role__in=['product_manager', 'engineering_manager'])

        if user.role == 'team_lead':
            return User.objects.filter(team=user.team)

        # developer, tester, customer can only see themselves
        return User.objects.filter(id=user.id)


# ----------------------------
# ProjectViewSet
# ----------------------------
# Manages Project instances (list, create, retrieve, update, delete).
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in for any action

    def get_permissions(self):
        """
        - create: Only Product Managers and Engineering Managers can create.
        - list: Product Managers and Engineering Managers can list.
        - retrieve/update/partial_update/destroy: Product Managers and Engineering Managers.
        """
        if self.action == 'create':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        if self.action == 'list':
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsProductManager() | IsEngineeringManager()]

        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Filter projects based on the requesting user's role:
        - Product Manager: Projects they manage.
        - Engineering Manager: All projects.
        """
        user = self.request.user

        if user.role == 'product_manager':
            return Project.objects.filter(manager=user)

        if user.role == 'engineering_manager':
            return Project.objects.all()

        return Project.objects.none()

    def perform_create(self, serializer):
        """
        When a project is created, automatically set the 'manager' field
        to the currently authenticated user.
        """
        serializer.save(manager=self.request.user)


# ----------------------------
# TeamViewSet
# ----------------------------
# Manages Team instances (list, create, retrieve, update, delete).
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in for any action

    def get_permissions(self):
        """
        - create: Only Engineering Managers can create new teams.
        - list: Engineering Managers and Team Leads can list.
        - retrieve/update/partial_update/destroy: Engineering Managers or Team Leads.
        """
        if self.action == 'create':
            return [IsAuthenticated(), IsEngineeringManager()]

        if self.action == 'list':
            return [IsAuthenticated(), IsEngineeringManager() | IsTeamLead()]

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsEngineeringManager() | IsTeamLead()]

        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Filter teams based on the requesting user's role:
        - Engineering Manager: All teams.
        - Team Lead: Only their own team.
        """
        user = self.request.user

        if user.role == 'engineering_manager':
            return Team.objects.all()

        if user.role == 'team_lead':
            return Team.objects.filter(lead=user)

        return Team.objects.none()

    def perform_create(self, serializer):
        """
        When a team is created, automatically set the 'lead' field
        to the currently authenticated user.
        """
        serializer.save(lead=self.request.user)


# ----------------------------
# UserBugsViewSet (Optional)
# ----------------------------
# Provides a custom endpoint to list all bugs assigned to a specific user.
class UserBugsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]  # Must be logged in for any action

    @action(detail=True, methods=['get'])
    def list_bugs(self, request, pk=None):
        """
        Returns all bugs assigned to the given user (pk).
        Only Product/Engineering Managers or the user themselves may access this.
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        # Only Product/Engineering Managers or the same user can view this endpoint
        if request.user.role not in ['product_manager', 'engineering_manager'] and request.user != user:
            return Response({"detail": "Permission denied"}, status=403)

        bugs = Bug.objects.filter(assigned_to=user)
        serializer = BugSerializer(bugs, many=True)
        return Response(serializer.data)


class PasswordResetAPIView(APIView):
    """
    Accepts POST { "email": "<user email>" } and, if the user exists,
    generates a UID & token, builds a reset link pointing to your React
    frontend, and sends it via email (console for dev).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Always return success to avoid email enumeration
            return Response({
                "detail": "If an account with that email exists, a reset link has been sent."
            }, status=status.HTTP_200_OK)

        # Build UID and token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Construct reset URL matching your React route
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        # Send email (printed to console in development)
        subject = "Password Reset Requested"
        message = f"Hi {user.get_full_name() or user.email},\n\n" \
                  f"Click the link below to reset your password:\n\n{reset_url}\n\n" \
                  "If you didn’t request this, just ignore this email."
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({
            "detail": "If an account with that email exists, a reset link has been sent."
        }, status=status.HTTP_200_OK)
