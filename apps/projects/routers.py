from rest_framework.routers import DefaultRouter

from .views import ProjectViewset, ProjectUserViewset

router = DefaultRouter()

router.register(r"projects", ProjectViewset)
router.register(r"projects-users", ProjectUserViewset, basename="project_user")
