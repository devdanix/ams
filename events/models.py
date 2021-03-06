
from django.db import models
from users.models import CustomUser
from companies.models import Companies

class Events(models.Model):
    userFK = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    companyFK = models.ForeignKey(Companies, on_delete=models.CASCADE, null=True, default='', blank=True)
    title = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()
    allDay = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title