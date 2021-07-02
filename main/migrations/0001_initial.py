# Generated by Django 3.2.4 on 2021-07-02 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='remarks_users',
            fields=[
                ('username', models.CharField(help_text='unique username', max_length=255, primary_key=True, serialize=False)),
                ('password', models.CharField(help_text='password', max_length=255)),
            ],
            options={
                'ordering': ['username'],
            },
        ),
    ]
