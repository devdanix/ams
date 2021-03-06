# Generated by Django 4.0.2 on 2022-03-09 15:00

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_customuser_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(blank=True, default='default-user-image.png', null=True, upload_to=users.models.user_directory_path),
        ),
    ]
