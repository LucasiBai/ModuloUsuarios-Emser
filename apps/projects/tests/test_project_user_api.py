from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status

from db.models import ProjectUser

from apps.users.tests.test_user_api import TOKEN_URL
from apps.projects.tests.test_project_api import post_projects

PROJECT_USER_LIST_URL = reverse("projects:project_user-list")


def get_first_project_user_detail_url(project_list):
    """
    Gets the reverse url of the first project in list
    """
    return reverse("projects:project_user-detail", kwargs={"pk": project_list[0].id})


MOCK_USERS = [
    {"username": "test1", "email": "test1@test.com", "first_name": "test1"},
    {"username": "test2", "email": "test2@test.com", "first_name": "test2"},
    {"username": "test3", "email": "test3@test.com", "first_name": "test3"},
    {"username": "test4", "email": "test4@test.com", "first_name": "test4"},
]


def post_users():
    """
    Posts user list into the database
    """
    user_list = []
    for current_user in MOCK_USERS:
        user = get_user_model().objects.create_user(**current_user)
        user_list.append(user)
    return user_list


class PublicProjectUserTests(TestCase):
    """
    Tests public projects user relation api with unauthenticated user
    """

    def setUp(self):
        """
        Set up client
        """
        self.client = APIClient()

        self.user_list = post_users()  # list of mock users
        self.project_list = post_projects()  # list of mock projects
        self.relation_list = [
            ProjectUser.objects.create_relation(
                self.user_list[0], self.project_list[2]
            ),
            ProjectUser.objects.create_relation(
                self.user_list[2], self.project_list[1]  # list of mock relation
            ),
            ProjectUser.objects.create_relation(
                self.user_list[1], self.project_list[4]
            ),
        ]

    def test_list_view_reject(self):
        """
        Tests if can see the project-user list
        """

        res = self.client.get(PROJECT_USER_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrive_view_reject(self):
        """
        Tests if can see the project-user retrieve
        """
        res = self.client.get(get_first_project_user_detail_url(self.relation_list))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_relation_reject(self):
        """
        Tests if can post relation
        """
        payload = {
            "user_id": self.user_list[3].id,
            "project_id": self.project_list[0].id,
        }

        res = self.client.post(PROJECT_USER_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_relation_reject(self):
        """
        Tests if can update a relation
        """
        payload = {
            "user_id": self.user_list[1].id,
            "project_id": self.project_list[4].id,
        }

        res = self.client.get(
            get_first_project_user_detail_url(self.relation_list), payload
        )

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_relation_reject(self):
        """
        Tests if can delete a relation
        """

        res = self.client.delete(get_first_project_user_detail_url(self.relation_list))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateProjectUserSuperuserTests(TestCase):
    """
    Tests the Project user api with superuser
    """

    def setUp(self):
        self.user_list = post_users()  # list of mock users
        self.project_list = post_projects()  # list of mock projects
        self.relation_list = [
            ProjectUser.objects.create_relation(
                self.user_list[0], self.project_list[2]
            ),
            ProjectUser.objects.create_relation(
                self.user_list[2], self.project_list[1]  # list of mock relation
            ),
            ProjectUser.objects.create_relation(
                self.user_list[1], self.project_list[4]
            ),
        ]

        self.client = APIClient()

        self.user_data = {
            "email": "test@test.com",
            "password": "test123",
            "username": "TestUsername",
        }
        self.user = get_user_model().objects.create_superuser(**self.user_data)

        self.client.force_authenticate(user=self.user)

        res_token = self.client.post(TOKEN_URL, self.user_data)  # get user token
        self.user_token = res_token.data["token"]

    def test_list_view_successful(self):
        """
        Tests if can see the project-user list
        """

        res = self.client.get(
            PROJECT_USER_LIST_URL, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrive_view_successful(self):
        """
        Tests if can see the project-user retrieve
        """
        res = self.client.get(
            get_first_project_user_detail_url(self.relation_list),
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_relation_successful(self):
        """
        Tests if can post relation
        """
        payload = {
            "user_id": self.user_list[3].id,
            "project_id": self.project_list[0].id,
        }

        res = self.client.post(
            PROJECT_USER_LIST_URL,
            payload,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_update_relation_successful(self):
        """
        Tests if can update a relation
        """
        payload = {
            "user_id": self.user_list[3].id,
            "project_id": self.project_list[0].id,
        }

        res = self.client.get(
            get_first_project_user_detail_url(self.relation_list),
            payload,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_delete_relation_successful(self):
        """
        Tests if can delete a relation
        """

        res = self.client.delete(
            get_first_project_user_detail_url(self.relation_list),
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)


class PrivateProjectUserAdminTests(TestCase):
    """
    Tests the Project user api with admin
    """

    def setUp(self):
        self.user_list = post_users()  # list of mock users
        self.project_list = post_projects()  # list of mock projects
        self.relation_list = [
            ProjectUser.objects.create_relation(
                self.user_list[0], self.project_list[2]
            ),
            ProjectUser.objects.create_relation(
                self.user_list[2], self.project_list[1]  # list of mock relation
            ),
            ProjectUser.objects.create_relation(
                self.user_list[1], self.project_list[4]
            ),
        ]

        self.client = APIClient()

        self.user_data = {
            "email": "test@test.com",
            "password": "test123",
            "username": "TestUsername",
        }
        self.user = get_user_model().objects.create_adminuser(**self.user_data)

        self.client.force_authenticate(user=self.user)

        res_token = self.client.post(TOKEN_URL, self.user_data)  # get user token
        self.user_token = res_token.data["token"]

    def test_list_view_successful(self):
        """
        Tests if can see the project-user list
        """

        res = self.client.get(
            PROJECT_USER_LIST_URL, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrive_view_successful(self):
        """
        Tests if can see the project-user retrieve
        """
        res = self.client.get(
            get_first_project_user_detail_url(self.relation_list),
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_relation_reject(self):
        """
        Tests if can post relation
        """
        payload = {
            "user_id": self.user_list[3].id,
            "project_id": self.project_list[0].id,
        }

        res = self.client.post(
            PROJECT_USER_LIST_URL,
            payload,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_relation_reject(self):
        """
        Tests if can update a relation
        """
        payload = {
            "user_id": self.user_list[1].id,
            "project_id": self.project_list[4].id,
        }

        res = self.client.put(
            get_first_project_user_detail_url(self.relation_list),
            payload,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_relation_reject(self):
        """
        Tests if can delete a relation
        """

        res = self.client.delete(
            get_first_project_user_detail_url(self.relation_list),
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
