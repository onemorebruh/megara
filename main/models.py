from django.db import models


# Create your models here.
class remarks_users(models.Model):
    # fields
    username = models.CharField(primary_key=True, max_length=255, help_text="unique username")
    password = models.CharField(max_length=255, help_text="password")

    # metadata
    class Meta:
        ordering = ["username"]

    # methods
    def get_absolute_url(self):
        return reverse('remarks-detail', args=[str(self.id)]) # почему это работает и помечено как ошибка одновременно

    def __str__(self):
        return self.username
