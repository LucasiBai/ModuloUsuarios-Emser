from django.test import TestCase
from django.contrib.auth import get_user_model


class ModelTest(TestCase):
    def test_create_user_with_email_successful(self):
        """
        Tests if it is possible to create a user with email address
        """
        email = "test@mitest.com"
        pwd = "testpassword"

        user = get_user_model().objects.create_user(email=email, password=pwd)

        self.assertEqual(email, user.email)
        self.assertTrue(user.check_password(pwd))

    def test_new_user_email_normalized(self):
        """
        Tests if email for new user is normalized
        """
        email = "test@MiTest.cOm"

        user = get_user_model().objects.create_user(email=email)

        self.assertEqual(user.email, email.lower())

    def test_create_superuser_with_email_successful(self):
        """
        Tests if it is possible to create a superuser with email address
        """
        email = "test@mitest.com"
        pwd = "testpassword"

        user = get_user_model().objects.create_superuser(email=email, password=pwd)
        self.assertEqual(email, user.email)
        self.assertTrue(user.check_password(pwd))

        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_user_with_email_exception(self):
        """
        Tests if the create user raise an error when it has'nt email address
        """

        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_user(email=None)

    def test_create_superuser_password_exception(self):
        """
        Tests if the create superuser raise an error when it has'nt password
        """
        email = "test@mitest.com"

        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_superuser(email=email, password=None)

    def test_create_superuser_email_exception(self):
        """
        Tests if the create superuser raise an error when it has'nt password
        """

        pwd = "testpassword"

        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_superuser(email=None, password=pwd)
