from django.urls import path

from .routers import router
from .views.token_views import LoginTokenObtainView, LoginTokenRefreshView


app_name = "users"

urlpatterns = [
    path("token/", LoginTokenObtainView.as_view(), name="user_token_obtain"),
    path("token/refresh/", LoginTokenRefreshView.as_view(), name="user_token_refresh"),
]

urlpatterns += router.urls
