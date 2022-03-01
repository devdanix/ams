from django.db import models

class Companies(models.Model):
    name = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    telephone = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


