# Generated by Django 4.0.2 on 2022-02-14 10:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0006_events_fk_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='events',
            old_name='fk_user',
            new_name='fkUser',
        ),
    ]