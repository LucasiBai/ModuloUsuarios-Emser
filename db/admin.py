from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext

from db import models


class UserAdmin(BaseUserAdmin):
    ordering = ["id"]
    list_display = ["email", "first_name", "last_name"]

    fieldsets = (
        (None, {"fields": ["username", "email", "password"]}),
        (
            gettext("Personal Info"),
            {"fields": ["first_name", "last_name", "phone_number"]},
        ),
        (gettext("Permissions"), {"fields": ["is_active", "user_type"]}),
        (gettext("Important Dates"), {"fields": ["last_login"]}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "password1", "password2", "user_type"),
            },
        ),
    )


admin.site.register(models.UserAccount, UserAdmin)
