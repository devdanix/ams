from django.contrib import admin
from .models import Companies

@admin.register(Companies)
class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'website',
        'telephone',
        'date_created',
    ]
