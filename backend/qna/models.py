from django.db import models
from user.models import User


class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    question_text = models.TextField(default='')
    asked_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-asked_on']

    def __str__(self):
        return f"{self.question_text}"

    def author(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question')
    answer_text = models.TextField(default='')

    def __str__(self):
        return f"{self.answer_text}"

    def author(self):
        return f"{self.question.user.first_name} {self.question.user.last_name}"
