from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer
from .models import Bug, Project, Team
from django.contrib.auth import get_user_model

User = get_user_model()

# Custom Login Serializer for dj-rest-auth
class CustomLoginSerializer(LoginSerializer):
    """
    Only username & password — drop any email field.
    """
    def get_fields(self):
        fields = super().get_fields()
        # Remove the email field if present
        fields.pop('email', None)
        # Enforce username & password required
        fields['username'] = serializers.CharField(required=True)
        fields['password'] = serializers.CharField(
            required=True,
            style={'input_type': 'password'},
            write_only=True
        )
        return fields

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)
    team = serializers.StringRelatedField(read_only=True)
    related_projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'team',
            'related_projects'
        ]

    def get_related_projects(self, obj):
        # PM: projects they manage
        if obj.role == 'product_manager':
            projects = Project.objects.filter(manager=obj)

        # TL or Developer: projects via assigned team
        elif obj.role in ['team_lead', 'developer', 'tester']:
            if obj.team:
                projects = Project.objects.filter(team=obj.team)
            else:
                projects = Project.objects.none()
        else:
            projects = Project.objects.none()

        return [project.name for project in projects]



# Project Serializer
class ProjectSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(read_only=True)
    teams = serializers.SerializerMethodField()
    bugs = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'manager', 'teams', 'bugs', 'created_at', 'updated_at']

    def get_teams(self, obj):
        teams = Team.objects.filter(project=obj)
        return [team.name for team in teams]

    def get_bugs(self, obj):
        bugs = Bug.objects.filter(project=obj)
        return [bug.title for bug in bugs]


# Team Serializer
class TeamSerializer(serializers.ModelSerializer):
    lead = serializers.StringRelatedField(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'lead', 'members', 'created_at', 'updated_at']

    def get_members(self, obj):
        # Fetch all users where team == this team
        users = User.objects.filter(team=obj)
        return [f"{user.first_name} {user.last_name} ({user.role})" for user in users]


# Bug Serializer
class BugSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField(read_only=True)

    # Allow only developers to be assigned
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='developer'),
        required=False
    )

    # These are shown as string labels, not editable
    team = serializers.StringRelatedField(read_only=True)
    project = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Bug
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'reported_by', 'assigned_to', 'team', 'project',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        user = self.context['request'].user

        # Only testers, customers, and admins can report bugs
        if user.role not in ['tester', 'customer', 'admin']:
            raise serializers.ValidationError("You are not allowed to report a bug.")

        validated_data['reported_by'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        user = self.context['request'].user
        role = user.role

        # Developers can only update status
        if role == 'developer':
            validated_data = {k: v for k, v in validated_data.items() if k == 'status'}

        # Team Leads can update status and priority
        elif role == 'team_lead':
            validated_data = {
                k: v for k, v in validated_data.items() if k in ['status', 'priority']
            }

        # Others (admin, pm, em) can update anything (no filtering)

        return super().update(instance, validated_data)
