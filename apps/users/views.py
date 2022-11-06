from django.contrib.auth import get_user_model

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import UserAccountSerializer


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
