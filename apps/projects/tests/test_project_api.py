from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status

from db.models import Project

from apps.users.tests.test_user_api import TOKEN_URL

MOCK_PROJECTS = [
    {"name": "Test Project 1"},
    {"name": "Test Project 2"},
    {"name": "Test Project 3"},
    {"name": "Test Project 4"},
    {"name": "Test Project 5"},
]

PROJECTS_LIST_URL = reverse("projects:project-list")


def get_first_project_detail_url(project_list):
    """
    Gets the reverse url of the first project in list
    """
    return reverse("projects:project-detail", kwargs={"pk": project_list[0].id})


def post_projects():
    """
    Posts user list into database
    """
    project_list = []
    for project in MOCK_PROJECTS:
        pr = Project.objects.create_project(**project)
        project_list.append(pr)
    return project_list


class PublicProjectsAPITests(TestCase):
    """
    Tests public projects api with unauthenticated user
    """

    def setUp(self):
        """
        Set up client
        """
        self.client = APIClient()

    def test_post_project_reject(self):
        """
        Tests if can post a project
        """
        res = self.client.post(PROJECTS_LIST_URL, MOCK_PROJECTS[0])
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_project_reject(self):
        """
        Tests if unauthenticated can update project
        """
        projects = post_projects()

        detail_url = get_first_project_detail_url(projects)

        payload = {"name": "NewTestName"}

        res = self.client.put(detail_url, payload)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_projects_successful(self):
        """
        Tests if unauthenticated can list projects
        """
        post_projects()

        res = self.client.get(PROJECTS_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_project_reject(self):
        """
        Tests if unauthenticated can delete project
        """
        projects = post_projects()

        detail_url = get_first_project_detail_url(projects)

        res_detail = self.client.delete(detail_url)

        self.assertEqual(res_detail.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateSuperuserProjectsAPITests(TestCase):
    """
    Tests private projects api with authenticated superuser
    """

    def setUp(self):
        """
        Set up client
        """
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

    def test_post_project_succesful(self):
        """
        Tests if can post a project
        """
        res = self.client.post(
            PROJECTS_LIST_URL,
            MOCK_PROJECTS[0],
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], MOCK_PROJECTS[0]["name"])

    def test_update_project_successful(self):
        """
        Tests if authenticated superuser can update project
        """
        projects = post_projects()

        payload = {"name": "NewTestName"}

        detail_url = get_first_project_detail_url(projects)

        res = self.client.put(
            detail_url, payload, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], payload["name"])

    def test_list_projects_successful(self):
        """
        Tests if can list projects
        """
        post_projects()

        res = self.client.get(
            PROJECTS_LIST_URL,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data[0]["name"], MOCK_PROJECTS[0]["name"])

    def test_delete_project_successful(self):
        """
        Tests if superuser can delete project
        """
        projects = post_projects()

        detail_url = get_first_project_detail_url(projects)

        res_detail = self.client.delete(
            detail_url, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res_detail.status_code, status.HTTP_204_NO_CONTENT)


class PrivateAdminProjectsAPITests(TestCase):
    """
    Tests private projects api with authenticated admin
    """

    def setUp(self):
        """
        Set up client
        """
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

    def test_post_project_reject(self):
        """
        Tests if can post a project
        """
        res = self.client.post(
            PROJECTS_LIST_URL,
            MOCK_PROJECTS[0],
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_reject(self):
        """
        Tests if authenticated adminuser can update project
        """
        projects = post_projects()

        detail_url = get_first_project_detail_url(projects)

        payload = {"name": "NewTestRejectName"}

        res = self.client.put(
            detail_url, payload, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_successful(self):
        """
        Tests if admin can list projects
        """
        post_projects()

        res = self.client.get(
            PROJECTS_LIST_URL,
            HTTP_AUTHORIZATION=f"Bearer {self.user_token}",
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data[0]["name"], MOCK_PROJECTS[0]["name"])

    def test_delete_project_reject(self):
        """
        Tests if adminuser can delete project
        """
        projects = post_projects()

        detail_url = get_first_project_detail_url(projects)

        res_detail = self.client.delete(
            detail_url, HTTP_AUTHORIZATION=f"Bearer {self.user_token}"
        )

        self.assertEqual(res_detail.status_code, status.HTTP_403_FORBIDDEN)
