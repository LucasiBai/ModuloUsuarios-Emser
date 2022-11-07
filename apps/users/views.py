from django.contrib.auth import get_user_model, authenticate

from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    UserAccountSerializer,
    LoginTokenObtainSerializer,
    LoginTokenRefreshSerializer,
)


class UserAccountViewset(ModelViewSet):
    """
    User Account Viewset
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserAccountSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]


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
