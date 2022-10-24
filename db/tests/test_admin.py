from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse


class ModelTest(TestCase):
    def setUp(self):
        """
        Set up method
        """
        self.client = Client()

        # Creating super user
        self.super_user = get_user_model().objects.create_superuser(
            email="testadmin@mitest.com", password="pass1234"
        )
        self.client.force_login(self.super_user)

        # Creating Normal User
        self.user = get_user_model().objects.create_user(
            email="testuser@mitest.com", password="pass1234", first_name="TestUserName"
        )

    def test_user_listed(self):
        """
        Tests if the users added were listed
        """
        url = reverse("admin:db_useraccount_changelist")
        res = self.client.get(url)

        # Testing if normal user is listed
        self.assertContains(res, self.user.first_name)
        self.assertContains(res, self.user.email)

        # Testing if super user is listed
        self.assertContains(res, self.super_user.email)

    def test_user_change_page(self):
        """
        Tests if the change page work
        """
        url = reverse("admin:db_useraccount_change", args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)
