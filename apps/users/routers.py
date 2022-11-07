from rest_framework.routers import DefaultRouter

from .views.viewset_views import UserAccountViewset

router = DefaultRouter()

router.register(r"accounts", UserAccountViewset, basename="user_account")
