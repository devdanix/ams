# Generated by Django 3.1.6 on 2021-12-23 10:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_events_all_day'),
    ]

    operations = [
        migrations.RenameField(
            model_name='events',
            old_name='all_day',
            new_name='allDay',
        ),
    ]