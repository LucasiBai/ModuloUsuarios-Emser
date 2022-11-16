from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser

from db.models import Project, ProjectUser
from .serializers import ProjectSerializer, ProjectUserSerializer
from .permissions import IsSuperuser


class ProjectViewset(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsSuperuser]

        return [permission() for permission in permission_classes]


class ProjectUserViewset(ModelViewSet):
    queryset = ProjectUser.objects.all()
    serializer_class = ProjectUserSerializer

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsSuperuser]

        return [permission() for permission in permission_classes]
