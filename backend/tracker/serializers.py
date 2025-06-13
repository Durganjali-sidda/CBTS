from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer
from .models import Bug, User, Project, Team
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

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'team']


# Project Serializer
class ProjectSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'manager', 'created_at', 'updated_at']


# Team Serializer
class TeamSerializer(serializers.ModelSerializer):
    lead = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'lead', 'members', 'created_at', 'updated_at']


# Bug Serializer
class BugSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField(read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='developer'), required=False
    )
    team = serializers.StringRelatedField(read_only=True)
    project = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Bug
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'reported_by', 'assigned_to', 'team', 'project',
            'created_at', 'updated_at'
        ]

    def update(self, instance, validated_data):
        user = self.context['request'].user
        role = user.role

        # Restrict updates based on role
        if role == 'developer':
            validated_data = {k: v for k, v in validated_data.items() if k == 'status'}
        elif role == 'team_lead':
            validated_data = {k: v for k, v in validated_data.items() if k in ['status', 'priority']}

        return super().update(instance, validated_data)

    def create(self, validated_data):
        validated_data['reported_by'] = self.context['request'].user
        return super().create(validated_data)
