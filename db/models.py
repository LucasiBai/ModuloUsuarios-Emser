from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

# User Model
class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        """Creates an user with email"""
        if not email:
            raise ValueError("Users must have an 'email address'")

        email = self.normalize_email(email)

        user = self.model(email=email, **kwargs)
        user.set_password(password)

        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **kwargs):
        """Creates a super user with email"""

        if not email or not password:
            raise ValueError("Users must have an 'email address' and 'password'")

        user = self.create_user(email, password, **kwargs)
        user.user_type = "superuser"
        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)
        return user

    def create_adminuser(self, email, password, **kwargs):
        """Creates a super user with email"""

        if not email or not password:
            raise ValueError("Users must have an 'email address' and 'password'")

        user = self.create_user(email, password, **kwargs)
        user.user_type = "admin"
        user.is_staff = True

        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    """Personalized model of User"""

    USER_TYPE_CHOISES = [("admin", "Admin User"), ("superuser", "Super User")]

    # Custom fields
    username = models.CharField(max_length=255, unique=True)
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    phone_number = models.IntegerField(null=True)
    email = models.EmailField(max_length=255, unique=True)
    user_type = models.CharField(
        max_length=20, choices=USER_TYPE_CHOISES, default="admin"
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


# Project Model


class ProjectManager(models.Manager):
    def create_project(self, name=None, **kwargs):
        if not name:
            raise ValueError("Projects must have a 'name'")

        project = self.model(name=name, **kwargs)

        project.save(using=self._db)

        return project


class Project(models.Model):
    """
    Project model
    """

    name = models.CharField(max_length=255, null=False)
    is_active = models.BooleanField(default=True)

    objects = ProjectManager()


# Project User Model
class ProjectUserManager(models.Manager):
    def create_relation(self, user_id=None, project_id=None, **kwargs):
        """
        Creates the relation between project and user
        """
        if not user_id or not project_id:
            raise ValueError("Relation must have a 'user_id' and 'project_id'")

        relation = self.model(user_id=user_id, project_id=project_id, **kwargs)

        relation.save(using=self._db)

        return relation


class ProjectUser(models.Model):
    """
    Project-user relation model
    """

    user_id = models.ForeignKey("UserAccount", on_delete=models.CASCADE)
    project_id = models.ForeignKey("Project", on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    objects = ProjectUserManager()
