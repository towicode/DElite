# Generated by Django 2.2.1 on 2019-08-28 19:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deaccount',
            name='DEpassword',
        ),
        migrations.RemoveField(
            model_name='deaccount',
            name='DEusername',
        ),
    ]
