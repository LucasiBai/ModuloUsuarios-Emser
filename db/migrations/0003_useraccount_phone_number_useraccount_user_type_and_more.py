# Generated by Django 4.1 on 2022-11-16 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("db", "0002_historicaluseraccount"),
    ]

    operations = [
        migrations.AddField(
            model_name="useraccount",
            name="phone_number",
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name="useraccount",
            name="user_type",
            field=models.CharField(
                choices=[("admin", "Admin User"), ("superuser", "Super User")],
                default="admin",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="useraccount",
            name="username",
            field=models.CharField(default="juan", max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name="HistoricalUserAccount",
        ),
    ]
