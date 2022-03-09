from django.urls import path
from .views import (QuestionView, )

urlpatterns = [
    path('askquestion/', QuestionView.as_view(), name='ask-question'),
]