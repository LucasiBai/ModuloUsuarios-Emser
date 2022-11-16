from rest_framework.permissions import BasePermission


class IsSuperuser(BasePermission):
    """
    Custom isSuperuser permission
    """

    def has_object_permission(self, request, view, obj):
        """
        Has permissions in object
        """
        superuser = request.user.is_superuser
        if not superuser:
            return False
        return superuser

    def has_permission(self, request, view):
        superuser = request.user.is_superuser
        if not superuser:
            return False
        return superuser
