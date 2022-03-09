import random
import datetime
from django.core.mail import send_mail
from backend.settings import EMAIL_HOST_USER
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings

from .models import (User, OTP, )
from .serializers import (RegisterSerializer, EditSerializer, LoginSerializer,
                          ChangeSerializer, ForgotSerializer, )

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class RegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request):

        user_serializer = self.serializer_class(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            user = User.objects.get(email=request.data['email'])
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)

            response = {
                'success': True,
                'message': 'User registered successfully',
                'token': token
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                'success': False,
                'message': 'User Already Registered!',
            }
            return Response(response, status=status.HTTP_409_CONFLICT)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            response = {
                'success': True,
                'message': 'User logged in successfully',
                'token': serializer.data['token']
            }
            return Response(response, status=status.HTTP_200_OK)
        response = {
            'success': False,
            'message': 'Invalid Credentials',
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request):
        try:
            user = User.objects.get(email=request.user)
            last_login = str(user.last_login + datetime.timedelta(hours=5.5))
            date_joined = str(user.date_joined + datetime.timedelta(hours=5.5))
            last_login = f"{last_login[:10]} {last_login[11:19]}"
            date_joined = f"{date_joined[:10]} {date_joined[11:19]}"
            response = {
                'success': True,
                'message': 'Profile fetched',
                'data': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'last_login': last_login,
                    'date_joined': date_joined
                }
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {
                'success': False,
                'message': 'User does not exists',
                'error': e.__str__()
            }
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        serializer = EditSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(User.objects.get(email=request.user), request.data)
            response = {
                'success': True
            }
            return Response(response, status=status.HTTP_200_OK)
        response = {
            'success': False
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class OTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
            try:
                otp = OTP.objects.get(user=user)
                otp.otp = random.randint(1000, 9999)
                otp.counter = otp.counter + 1
            except OTP.DoesNotExist:
                otp = OTP()
                otp.user = user
                otp.otp = random.randint(1000, 9999)
                otp.counter = otp.counter + 1
            otp.save()
            try:
                send_mail(
                    'OTP for Forgotten Password',
                    f"Dear {user.first_name} {user.last_name},\nFollowing are the details for your forgotten password "
                    f"registered under {user.email}.\n\nOTP : {otp.otp}\nThank you",
                    EMAIL_HOST_USER,
                    [f"{user.email}"],
                    fail_silently=False
                )
            except:
                response = {
                    'success': False,
                    'message': 'Could not send email. Please try again later',
                }
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            response = {
                'success': True,
                'message': 'OTP sent to email successfully',
            }
            return Response(response, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            response = {
                'success': False,
                'message': 'Email does not exist',
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class VerifyOtp(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data['email']
        otp = int(request.data['otp'])
        try:
            user = User.objects.get(email=email)
            try:
                otp_obj = OTP.objects.get(user=user)
                if otp == otp_obj.otp and user == otp_obj.user:
                    user.is_otp_verified = True
                    user.save()
                    response = {
                        'success': True,
                        'message': 'OTP verified'
                    }
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    response = {
                        'success': False,
                        'message': 'OTP could not be verified'
                    }
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)
            except OTP.DoesNotExist:
                response = {
                    'success': False,
                    'message': 'Please generate an OTP on registered email'
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            response = {
                'success': False,
                'message': 'Could not find user'
            }
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPassword(APIView):
    permission_classes = (AllowAny,)
    serializer_class = ForgotSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = {
            'success': True,
        }
        return Response(response, status=status.HTTP_200_OK)


class ChangePassword(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangeSerializer(User.objects.get(email=request.user), request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = {
            'success': True,
            'message': 'Password updated successfully',
        }
        status_code = status.HTTP_200_OK
        return Response(response, status=status_code)
