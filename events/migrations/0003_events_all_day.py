# Generated by Django 3.1.6 on 2021-12-23 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_auto_20211123_1647'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='all_day',
            field=models.BooleanField(default=False),
        ),
    ]
