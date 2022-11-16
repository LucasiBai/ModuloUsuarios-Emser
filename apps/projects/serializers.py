from rest_framework import serializers

from db.models import Project, ProjectUser


class ProjectSerializer(serializers.ModelSerializer):
    """
    Project model serializer
    """

    class Meta:
        model = Project
        fields = ["id", "name", "is_active"]
        extra_kwargs = {"id": {"read_only": True}}
