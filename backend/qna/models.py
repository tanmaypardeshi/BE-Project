from django.db import models
from user.models import User


class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    questionText = models.TextField(default='')
    answer = models.TextField(default='')
    askedOn = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['askedOn']

    def __str__(self):
        return f"{self.questionText}"

    def author(self):
        return f"{self.user.first_name} {self.user.last_name}"
