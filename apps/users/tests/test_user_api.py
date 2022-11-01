from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

CREATE_USER_URL = reverse("users:create")  # url of create user API


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
            "password": "testpassword",  # Mock user data
            "first_name": "Test",
        }

        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(**res.data)

        self.assertTrue(user.check_password(payload["password"]))
        self.assertNotIn("password", res.data)


# class PrivateUsersAPITests(TestCase):
#     """
#     Tests Private user api
#     """

#     def setUp(self):
#         self.client = APIClient()

#         self.user = create_user(
#             first_name="Test", email="testuser@test.com", password="testpassword123"
#         )
