from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse


class ModelTest(TestCase):
    def setUp(self):
        """
        Set up method
        """
        self.client = Client()

        self.super_user = get_user_model().objects.create_superuser(
            email="testadmin@mitest.com", password="pass1234"  # Creating super user
        )
        self.client.force_login(self.super_user)

        self.user = get_user_model().objects.create_user(
            email="testuser@mitest.com",
            password="pass1234",
            first_name="TestUserName",  # Creating Normal User
        )

    def test_user_listed(self):
        """
        Tests if the users added were listed
        """
        url = reverse("admin:db_useraccount_changelist")
        res = self.client.get(url)

        self.assertContains(
            res, self.user.first_name  # Testing if normal user is listed
        )
        self.assertContains(res, self.user.email)

        self.assertContains(
            res, self.super_user.email  # Testing if super user is listed
        )

    def test_user_change_page(self):
        """
        Tests if the change page work
        """
        url = reverse("admin:db_useraccount_change", args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)  # Testing if status code is 200

    def test_create_user_page(self):
        """
        Tests if the create user page work
        """
        url = reverse("admin:db_useraccount_add")
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)  # Testing if status code is 200
