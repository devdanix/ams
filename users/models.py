from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractUser

def user_directory_path(instance, filename):

    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.username, filename)


class CustomUser(AbstractUser):

    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")
    image = models.ImageField(upload_to=user_directory_path, null=True, default='media/default-user-image.png', blank=True)

    USERNAME_FIELD = "username"   # e.g: "username", "email"
    EMAIL_FIELD = "email"         # e.g: "email", "primary_email"

