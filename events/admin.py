from django.contrib import admin
from .models import Events
from users.models import CustomUser

@admin.register(Events)
class EventsAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'title',
        'start',
        'end',
        'date_created',
        'get_username'
    ]

    @admin.display(ordering='userFK__username', description="Username")
    def get_username(self, obj):
        return obj.userFK.username
