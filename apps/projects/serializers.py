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


class ProjectUserSerializer(serializers.ModelSerializer):
    """
    Project User relation serializer
    """

    class Meta:
        model = ProjectUser
        fields = ["id", "user_id", "project_id", "is_active"]
        extra_kwargs = {"id": {"read_only": True}}

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "author": {
                "id": instance.user_id.id,
                "username": instance.user_id.username,
                "email": instance.user_id.email,
            },
            "project": {
                "id": instance.project_id.id,
                "name": instance.project_id.name,
            },
            "is_active": instance.is_active,
        }
