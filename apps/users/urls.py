from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .routers import router
from .views import LoginTokenObtainView


app_name = "users"

urlpatterns = [
    path("token/", LoginTokenObtainView.as_view(), name="user_token_obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

urlpatterns += router.urls
