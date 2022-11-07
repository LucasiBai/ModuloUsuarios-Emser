from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.serializers import (
    UserAccountSerializer,
    LoginTokenObtainSerializer,
    LoginTokenRefreshSerializer,
)


class LoginTokenObtainView(TokenObtainPairView):
    serializer_class = LoginTokenObtainSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get("email", "")
        password = request.data.get("password", "")

        user = authenticate(email=email, password=password)

        if user:
            login_serializer = self.serializer_class(data=request.data)
            if login_serializer.is_valid():
                user_serializer = UserAccountSerializer(user)
                return Response(
                    {
                        "token": login_serializer.validated_data["access"],
                        "refresh-token": login_serializer.validated_data["refresh"],
                        "user": user_serializer.data,
                        "message": "Successful request",
                    },
                    status=status.HTTP_202_ACCEPTED,
                )
            return Response(login_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"message": "User authentication error"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginTokenRefreshView(TokenRefreshView):
    serializer_class = LoginTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh-token", "")

        serializer = self.serializer_class(data={"refresh": refresh_token})
        if serializer.is_valid():
            return Response(
                {
                    "updated-token": serializer.validated_data["access"],
                    "message": "Successful request",
                },
                status=status.HTTP_202_ACCEPTED,
            )
        return Response(
            {"message": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST
        )
