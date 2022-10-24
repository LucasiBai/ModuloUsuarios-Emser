from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext

from db import models


class UserAdmin(BaseUserAdmin):
    ordering = ["id"]
    list_display = ["email", "first_name", "last_name"]

    fieldsets = (
        (None, {"fields": ["email", "password"]}),
        (gettext("Personal Info"), {"fields": ["first_name", "last_name"]}),
        (gettext("Permissions"), {"fields": ["is_active", "is_staff", "is_superuser"]}),
        (gettext("Important Dates"), {"fields": ["last_login"]}),
    )


admin.site.register(models.UserAccount, UserAdmin)
