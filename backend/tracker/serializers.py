from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Bug, Project, Team
from django.contrib.auth import get_user_model

User = get_user_model()

# ----------------------------
# Custom Login Serializer
# ----------------------------
class CustomLoginSerializer(TokenObtainPairSerializer):
    """
    Custom login serializer using username and password only.
    """
    username_field = 'username'

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # You can add any additional data you want returned on login
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
        }
        return data

# ----------------------------
# Basic Nested Serializers
# ----------------------------
class TeamBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name']

class ProjectBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description']

class BugBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bug
        fields = ['id', 'title', 'status', 'priority']


# ----------------------------
# User Serializer
# ----------------------------
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)
    team = TeamBasicSerializer(read_only=True)
    related_projects = serializers.SerializerMethodField()
    assigned_bugs = serializers.SerializerMethodField()
    reported_bugs = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'team',
            'related_projects', 'assigned_bugs', 'reported_bugs'
        ]

    def get_related_projects(self, obj):
        if obj.role == 'product_manager':
            projects = Project.objects.filter(manager=obj)
        elif obj.role in ['team_manager', 'team_lead', 'developer', 'tester']:
            if obj.team:
                projects = Project.objects.filter(team=obj.team)
            else:
                projects = Project.objects.none()
        else:
            projects = Project.objects.none()
        return ProjectBasicSerializer(projects, many=True).data

    def get_assigned_bugs(self, obj):
        if obj.role == 'developer':
            bugs = Bug.objects.filter(assigned_to=obj)
            return BugBasicSerializer(bugs, many=True).data
        return []

    def get_reported_bugs(self, obj):
        bugs = Bug.objects.filter(reported_by=obj)
        return BugBasicSerializer(bugs, many=True).data


# ----------------------------
# Project Serializer
# ----------------------------
class ProjectSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(read_only=True)
    teams = serializers.SerializerMethodField()
    bugs = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'manager',
            'teams', 'bugs', 'created_at', 'updated_at'
        ]

    def get_teams(self, obj):
        teams = Team.objects.filter(project=obj)
        return [team.name for team in teams]

    def get_bugs(self, obj):
        bugs = Bug.objects.filter(project=obj)
        return [bug.title for bug in bugs]


# ----------------------------
# Team Serializer
# ----------------------------
class TeamSerializer(serializers.ModelSerializer):
    lead = serializers.StringRelatedField(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'lead', 'members', 'created_at', 'updated_at']

    def get_members(self, obj):
        users = User.objects.filter(team=obj)
        return [f"{user.first_name} {user.last_name} ({user.role})" for user in users]


# ----------------------------
# Bug Serializer
# ----------------------------
class BugSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField(read_only=True)

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='developer'),
        required=False,
        allow_null=True
    )

    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    team = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Bug
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'reported_by', 'assigned_to', 'team', 'project',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        user = self.context['request'].user

        # Enforce role-level bug reporting
        if user.role not in ['tester', 'customer', 'product_manager', 'engineering_manager', 'team_manager']:
            raise serializers.ValidationError("You are not allowed to report a bug.")

        validated_data['reported_by'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        user = self.context['request'].user
        role = user.role

        # Restrict update fields based on role
        if role == 'developer':
            validated_data = {
                k: v for k, v in validated_data.items() if k == 'status'
            }
        elif role in ['team_lead', 'team_manager']:
            validated_data = {
                k: v for k, v in validated_data.items() if k in ['status', 'priority']
            }

        return super().update(instance, validated_data)
