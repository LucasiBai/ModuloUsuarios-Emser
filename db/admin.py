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


class ProjectAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = ["name", "is_active"]

    fieldsets = ((None, {"fields": ["name"]}),)

    add_fieldsets = ((None, {"classes": ("wide",), "fields": ["name"]}),)


class ProjectUserAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = ["user_id", "project_id", "is_active"]

    fieldsets = ((None, {"fields": ["user_id", "project_id"]}),)

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": [
                    "user_id",
                    "project_id",
                ],
            },
        ),
    )


admin.site.register(models.UserAccount, UserAdmin)
admin.site.register(models.Project, ProjectAdmin)
admin.site.register(models.ProjectUser, ProjectUserAdmin)
