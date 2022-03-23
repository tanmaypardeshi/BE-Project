import datetime

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .serializers import QuestionSerializer
from user.models import User
from .models import Question
from e2c.answerquestion import getAnswer


def get_answer(question):
    answers = getAnswer(question)
    print(answers)
    return answers[0]
    #return f"Question is {question}. Answer is FO"


class QuestionView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )
    serializer_class = QuestionSerializer

    def get(self, request, *args, **kwargs):
        query_set = Question.objects.filter(user=request.user)
        data = QuestionSerializer(query_set, many=True).data
        response = {
            'success': True,
            'history': data,
        }
        return Response(response, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            answer = get_answer(question=request.data['question_text'])
        except Exception as e:
            response = {
                'success': False,
                'message': e.__str__()
            }
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        user = User.objects.get(email=request.user)
        data = {
            'user': user.pk,
            'question_text': request.data['question_text'],
            'answer_text': answer,
        }
        qna = self.serializer_class(data=data)
        if qna.is_valid():
            qna.save()
            response = {
                'success': True,
                'message': "Added Question and Answer Successfully",
                'answer': answer
            }
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {
                'success': False,
                'message': "Could not add question"
            }
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


