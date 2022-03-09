from rest_framework.serializers import ModelSerializer
from user.models import User
from .models import Question


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ['user', 'question_text', 'answer_text', 'asked_on']

    def create(self, validated_data):
        qna = Question.objects.create(user=validated_data['user'], question_text=validated_data['question_text'],
                                      answer_text=validated_data['answer_text'])
        qna.save()
        return qna


