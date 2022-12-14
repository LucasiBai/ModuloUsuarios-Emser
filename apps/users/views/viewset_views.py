from django.contrib.auth import get_user_model

from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from apps.users.serializers import UserAccountSerializer


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

    def get_user_instance(self, request):
        """
        Gets user model instance
        """
        user_pk = request.user.id
        user = get_user_model().objects.filter(pk=user_pk).first()

        return user

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def get_me_data(self, request, *args, **kwargs):
        """
        Shows the user data
        """

        user = self.get_user_instance(request)

        if request.method == "GET":
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "PATCH":
            serializer = self.serializer_class(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
