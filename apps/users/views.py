from django.contrib.auth import get_user_model

from rest_framework.viewsets import ModelViewSet

from .serializers import UserAccountSerializer


class UserAccountViewset(ModelViewSet):
    """
    User Account Viewset
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserAccountSerializer
