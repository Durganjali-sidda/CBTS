# tracker/serializers.py
from dj_rest_auth.serializers import LoginSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Bug 

class CustomLoginSerializer(LoginSerializer):
    username = None  # Remove the username field
    email = serializers.EmailField(required=True)  # Use email for authentication

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid login credentials")
        else:
            raise serializers.ValidationError("Must include email and password")
        
        attrs['user'] = user
        return attrs

class BugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bug
        fields = '__all__'