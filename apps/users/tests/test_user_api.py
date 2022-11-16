from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from rest_framework_simplejwt.exceptions import TokenError


CREATE_USER_URL = reverse("users:user_account-list")  # create user API url
ME_URL = reverse("users:user_account-get-me-data")  # get user API url
RESET_PASSWORD_URL = reverse("users:reset_password")  # reset user password url

TOKEN_URL = reverse("users:user_token_obtain")  # user token url
TOKEN_REFRESH_URL = reverse("users:user_token_refresh")  # user token refresh url


def create_user(**kwargs):
    """
    Function to create an user in db
    """
    return get_user_model().objects.create_user(**kwargs)


class PublicUsersAPITests(TestCase):
    """
    Tests public users api
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
            "last_name": "Testi",
            "username": "TestUsername",
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

    def test_create_token_for_user(self):
        """
        Tests if can create JWT succesfuly
        """
        payload = {
            "email": "test@.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }

        user = create_user(**payload)

        res = self.client.post(TOKEN_URL, payload)

        self.assertIn("token", res.data)
        self.assertIn("refresh-token", res.data)
        self.assertIn("message", res.data)

        self.assertEqual(user.email, res.data["user"]["email"])

        self.assertEqual(status.HTTP_202_ACCEPTED, res.status_code)

    def test_create_token_invalid_credentials(self):
        """
        Tests if JWT was'nt created without invalid credentials
        """

        create_user(email="test@test.com", password="test123")

        payload = {
            "email": "test@test.com",
            "password": "wrongpassword",  # Mock wrong user password data
            "first_name": "Test",
        }

        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn("token", res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_no_user(self):
        """
        Tests if JWT was'nt created without user
        """
        payload = {
            "email": "test@test.com",
            "password": "Test123",  # Mock user data
            "first_name": "Test",
        }

        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn("token", res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_missing_field(self):
        """
        Tests if email and password are required
        """
        res = self.client.post(TOKEN_URL, {"email": "", "password": ""})

        self.assertNotIn("token", res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_token_success(self):
        """
        Tests if can refresh the JWT
        """
        payload = {
            "email": "test@.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }
        create_user(**payload)

        res_token = self.client.post(TOKEN_URL, payload)
        refresh_token = res_token.data["refresh-token"]

        res_refresh = self.client.post(
            TOKEN_REFRESH_URL, {"refresh-token": refresh_token}
        )

        self.assertIn("updated-token", res_refresh.data)
        self.assertIn("message", res_refresh.data)

        self.assertEqual(res_refresh.status_code, status.HTTP_202_ACCEPTED)

    def test_invalid_refresh_token(self):
        """
        Tests if refresh token raise exception
        """

        with self.assertRaises(TokenError):
            self.client.post(
                TOKEN_REFRESH_URL,
                {"refresh-token": "invalid.token.id"},
            )

    def test_retrieve_user_unauthorized(self):
        """
        Tests if rejects the unauthorized data
        """

        res = self.client.get(ME_URL)

        self.assertNotIn("email", res.data)
        self.assertNotIn("username", res.data)
        self.assertNotIn("first_name", res.data)
        self.assertNotIn("last_name", res.data)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_reset_password_successful(self):
        """
        Tests if receives password reset
        """
        payload = {
            "email": "test@gmail.com",
            "password": "testpassword",  # Mock user create data
            "first_name": "Test",
        }
        create_user(**payload)

        res = self.client.post(RESET_PASSWORD_URL, {"email": payload["email"]})

        self.assertEqual(status.HTTP_200_OK, res.status_code)
        self.assertIn("message", res.data)

    def test_reset_password_invalid_email(self):
        """
        Tests if raise an error when email is invalid
        """

        res = self.client.post(RESET_PASSWORD_URL, {"email": "testemail@gmail.com"})

        self.assertEqual(status.HTTP_404_NOT_FOUND, res.status_code)
        self.assertIn("email", res.data)


class PrivateUsersAPITests(TestCase):
    """
    Tests private users api
    """

    def setUp(self):
        self.client = APIClient()

        self.user_data = {
            "email": "test@test.com",
            "password": "test123",
            "username": "TestUsername",
        }

        self.user = create_user(**self.user_data)
        self.client.force_authenticate(user=self.user)

        res_token = self.client.post(TOKEN_URL, self.user_data)  # get user token
        self.user_token = res_token.data["token"]

    def test_retrieve_user_success(self):
        """
        Tests gets the user data
        """

        res = self.client.get(ME_URL, HTTP_AUTHORIZATION=f"Bearer {self.user_token}")

        self.assertEqual(res.data["email"], self.user.email)
        self.assertEqual(res.data["first_name"], self.user.first_name)

        self.assertNotIn("password", res.data)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_me_not_allowed(self):
        """
        Tests if posts is not allowed
        """
        res = self.client.post(
            ME_URL,
            {"email": "test@email.com", "password": "test123"},
        )

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_data_succesful(self):
        """
        Tests if authorized user can update profile
        """
        payload = {
            "email": "newemail@test.com",
            "password": "newpassword",  # Mock user data
            "first_name": "NewName",
            "last_name": "NewLast",
            "username": "NewUser",
        }

        res = self.client.patch(
            ME_URL, payload, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )
        self.user.refresh_from_db()

        self.assertEqual(res.data["email"], payload["email"])
        self.assertEqual(res.data["first_name"], payload["first_name"])
        self.assertTrue(self.user.check_password(payload["password"]))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
