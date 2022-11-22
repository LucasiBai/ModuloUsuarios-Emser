from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode

from rest_framework import serializers

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from .utils import send_reset_password_email


class UserAccountSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "phone_number",
            "user_type",
            "is_active",
            "is_staff",
            "is_superuser",
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

    def update(self, instance, validated_data):
        """
        Updates an user data and password
        """
        password = validated_data.pop("password", None)

        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class ResetPasswordSerializer(serializers.Serializer):
    """
    Reset password Serializer
    """

    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ["email"]

    def validate_email(self, value):
        """
        Validates if email has an user asossiated
        """
        associated_user = get_user_model().objects.filter(email=value).exists()

        if not associated_user:
            raise serializers.ValidationError(
                "Email entered must be associated with an user"
            )
        return value

    def save(self, **kwargs):
        """
        Sends an email with the data
        """
        email = self.validated_data["email"]

        send_reset_password_email(email)


class ChangePasswordSerializer(serializers.Serializer):
    """
    Changes the user password serializer
    """

    password = serializers.CharField(min_length=5, write_only=True)

    class Meta:
        fields = ["password"]

    def validate(self, attrs):
        password = attrs.get("password", "")
        token = self.context["kwargs"]["token"]
        encoded_pk = self.context["kwargs"]["encoded_pk"]

        if encoded_pk is None or token is None:
            raise serializers.ValidationError("Missing token or encoded pk")

        pk = urlsafe_base64_decode(encoded_pk).decode()
        user = get_object_or_404(get_user_model(), pk=pk)

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Unknown token")

        user.set_password(password)
        user.save()

        return attrs


class LoginTokenObtainSerializer(TokenObtainPairSerializer):
    """
    Serializer to obtain JWT
    """


class LoginTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Serializer to refresh JWT
    """
