# Generated by Django 4.1 on 2022-11-16 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("db", "0003_useraccount_phone_number_useraccount_user_type_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("is_active", models.BooleanField(default=True)),
            ],
        ),
    ]
