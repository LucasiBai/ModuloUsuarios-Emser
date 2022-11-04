from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status


CREATE_USER_URL = reverse("users:user_account-list")  # url of create user API


def create_user(**kwargs):
    """
    Function to create an user in db
    """
    return get_user_model().objects.create_user(**kwargs)


class PublicUsersAPITests(TestCase):
    """
    Tests Public user api
    """

    def setUp(self):
        """
        Set up Public user api
        """
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """
        Tests if it is possible to create a user with email address in API
        """
        payload = {
            "email": "test@mitest.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }

        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        user = get_user_model().objects.get(**res.data)
        self.assertTrue(user.check_password(payload["password"]))
        self.assertNotIn("password", res.data)

    def test_user_exists(self):
        """
        Tests if exists the inserted user
        """
        payload = {
            "email": "test@mitest.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }
        create_user(**payload)

        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_invalid_email(self):
        """
        Tests if catch exception of invalid email adress
        """
        payload = {
            "email": "test@.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }

        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)

    def test_user_password_too_short(self):
        """
        Tests if catch exception of short password
        """
        payload = {
            "email": "test@test.com",
            "password": "123",  # Mock user create data
            "first_name": "Test",
        }

        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)


# class PrivateUsersAPITests(TestCase):
#     """
#     Tests Private user api
#     """

#     def setUp(self):
#         self.client = APIClient()

#         self.user = create_user(
#             first_name="Test", email="testuser@test.com", password="testpassword123"
#         )
