# Generated by Django 4.0.2 on 2022-02-04 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_auto_20211223_1036'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
