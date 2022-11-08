from django.contrib.auth import get_user_model

from rest_framework import serializers

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)


class UserAccountSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "is_active",
            "is_staff",
        ]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 5},
            "id": {"read_only": True},
        }

    def create(self, validated_data):
        """
        Create a new user with create_user
        """
        user = get_user_model().objects.create_user(**validated_data)
        return user


class LoginTokenObtainSerializer(TokenObtainPairSerializer):
    """
    Serializer to obtain JWT
    """


class LoginTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Serializer to refresh JWT
    """
