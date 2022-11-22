from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.users.serializers import ResetPasswordSerializer, ChangePasswordSerializer


class ResetPasswordApiview(APIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Email sended"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class ChangePasswordApiview(APIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"kwargs": kwargs}
        )

        if serializer.is_valid():
            return Response(
                {"message": "Password changed successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
