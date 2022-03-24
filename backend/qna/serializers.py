from rest_framework.serializers import ModelSerializer
from .models import Question, Answer


class AnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_text']


class QuestionSerializer(ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['user', 'question_text', 'asked_on', 'answers']
