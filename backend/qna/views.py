import datetime

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from user.models import User
from .models import Question, Answer
from e2c.answerquestion import getAnswer


def get_answer(question):
    answers = getAnswer(question)
    return answers


class QuestionView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def get(self, request, *args, **kwargs):
        data = []
        questions = Question.objects.filter(user=request.user)
        for question in questions:
            answers = Answer.objects.filter(question=question)
            data.append({
                'question': str(question),
                'answer': list(answers.values_list('answer_text', flat=True))
            })
        response = {
            'success': True,
            'history': data,
        }
        return Response(response, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            answers = get_answer(question=request.data['question_text'])
            user = User.objects.get(email=request.user)
            question = Question(
                user=user, question_text=request.data['question_text'])
            question.save()
            for answer in answers:
                ans = Answer(question=question, answer_text=answer)
                ans.save()
            response = {
                'success': True,
                'message': "Added Question and Answer Successfully",
                'answer': answers
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {
                'success': False,
                'message': e.__str__()
            }
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
