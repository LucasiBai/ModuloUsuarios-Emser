from django.test import TestCase
from django.contrib.auth import get_user_model

from db.models import Project, ProjectUser


class UserModelTest(TestCase):
    def test_create_user_with_email_successful(self):
        """
        Tests if it is possible to create a user with email address
        """
        email = "test@mitest.com"
        pwd = "testpassword"

        user = get_user_model().objects.create_user(email=email, password=pwd)

        self.assertEqual(email, user.email)
        self.assertTrue(user.check_password(pwd))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_new_user_email_normalized(self):
        """
        Tests if email for new user is normalized
        """
        email = "test@MiTest.cOm"

        user = get_user_model().objects.create_user(email=email)

        self.assertEqual(user.email, email.lower())

    def test_create_user_with_email_exception(self):
        """
        Tests if the create user raise an error when it has'nt email address
        """

        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(email=None)

    def test_create_superuser_with_email_successful(self):
        """
        Tests if it is possible to create a superuser with email address
        """
        email = "test@mitest.com"
        pwd = "testpassword"

        user = get_user_model().objects.create_superuser(email=email, password=pwd)

        self.assertEqual(email, user.email)
        self.assertTrue(user.check_password(pwd))

        self.assertEqual(user.user_type, "superuser")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_adminuser_with_email_successful(self):
        """
        Tests if it is possible to create an adminuser with email address
        """
        email = "test@mitest.com"
        pwd = "testpassword"

        user = get_user_model().objects.create_adminuser(email=email, password=pwd)

        self.assertEqual(email, user.email)
        self.assertTrue(user.check_password(pwd))

        self.assertEqual(user.user_type, "admin")
        self.assertTrue(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser_password_exception(self):
        """
        Tests if the create superuser raise an error when it has'nt password
        """
        email = "test@mitest.com"

        with self.assertRaises(ValueError):
            get_user_model().objects.create_superuser(email=email, password=None)

    def test_create_adminuser_password_exception(self):
        """
        Tests if the create superuser raise an error when it has'nt password
        """
        email = "test@mitest.com"

        with self.assertRaises(ValueError):
            get_user_model().objects.create_adminuser(email=email, password=None)


class ProjectModelTest(TestCase):
    def setUp(self):
        self.mock_project = {"name": "Modulo de usuarios", "is_active": True}

    def test_create_project_succesful(self):
        """
        Tests if can create a project
        """

        project = Project.objects.create_project(**self.mock_project)

        self.assertEqual(project.name, "Modulo de usuarios")
        self.assertTrue(project.is_active)

    def test_auto_active_project(self):
        """
        Tests if created project has is_active turn in True
        """

        project = Project.objects.create_project(name="Modulo de usuarios")

        self.assertEqual(project.name, "Modulo de usuarios")
        self.assertTrue(project.is_active)

    def test_no_name_project_exception(self):
        """
        Tests if create project raise an error when it has'nt name
        """
        with self.assertRaises(ValueError):
            Project.objects.create_project()


class ProjectUserModelTest(TestCase):
    def setUp(self):
        self.mock_user = {
            "username": "Test",
            "email": "test@test.com",
            "password": "123",
            "first_name": "test",
            "last_name": "Test",
        }
        self.mock_project = {"name": "Modulo de usuarios"}

        self.user = get_user_model().objects.create_user(**self.mock_user)
        self.project = Project.objects.create_project(**self.mock_project)

    def test_create_project_user_succesful(self):
        """
        Tests if can create project-user relation
        """
        project = ProjectUser.objects.create_relation(
            user_id=self.user, project_id=self.project
        )

        self.assertEqual(project.user_id.id, self.user.id)
        self.assertEqual(project.project_id.id, self.project.id)
        self.assertTrue(project.is_active)

    def test_create_relation_no_user_exception(self):
        """
        Tests if create project relation raise an error when it has'nt user id
        """

        with self.assertRaises(ValueError):
            ProjectUser.objects.create_relation(project_id=self.project)

    def test_create_relation_no_project_exception(self):
        """
        Tests if create project relation raise an error when it has'nt project id
        """

        with self.assertRaises(ValueError):
            ProjectUser.objects.create_relation(user_id=self.user)
