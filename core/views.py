from rest_framework import status, generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate, logout
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters import rest_framework as filters
from datetime import timedelta
import logging
import random
import string

from .serializers import SignUpSerializer, UserSerializer, EventRegistrationSerializer, EventSerializer, ReservationCodeSerializer
from .models import User, Event, ReservationCode


logger = logging.getLogger(__name__)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"


class SingUpView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug(request)
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "status": "success",
                "data": {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": UserSerializer(user).data,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "status": "success",
                "data": {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": UserSerializer(user).data,
                }
            }, status=status.HTTP_200_OK)
        return Response({"status": "error", "data": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class SignOutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({
                "status": "error",
                "data": "Refresh token is required",
            }, statu=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
            return Response({
                "status": "success",
                "data": "successfully signed out",
            }, status=status.HTTP_200_OK)
        except:
            logout(request)
            return Response({
                "status": "error",
                "data": "failed to blacklist a refresh token"
            }, statu=status.HTTP_400_BAD_REQUEST)

class RegisterOnEventView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def generate_random_code(self, k=10):
        return "".join(random.choices(string.ascii_uppercase + string.digits, k=k))

    def post(self, request):
        user = request.user
        event_id = request.data.get("event_id")
        if not event_id:
            return Response({
                "status": "error",
                "data": "You should have sent event_id"
            }, status=status.HTTP_400_BAD_REQUEST)
        event = Event.objects.get(id=event_id)
        res_code = self.generate_random_code(k=10)
        if ReservationCode.objects.filter(owner=user, event=event).exists():
            return Response({"status": "error", "data": "already registered"}, status=status.HTTP_400_BAD_REQUEST)
        serializer =  EventRegistrationSerializer(data={"code": res_code, "owner": user.id, "event": event.id})
        if serializer.is_valid():
            reservation = serializer.save()
            return Response({"status": "success", "data": reservation.code}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CancelEventView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        reservation_code = request.data.get("reservation_code")
        try:
            reservation = ReservationCode.objects.get(code=reservation_code, owner=user)
            # TODO: validate dates
            event = reservation.event
            event_duration = event.end_date - event.start_date
            if event_duration > timedelta(days=2):
                return Response({
                    "status": "error",
                    "data": "You can only cancel an event that lasts longer than 2 days",
                }, status=status.HTTP_400_BAD_REQUEST)
            now = timezone.now()
            cancel_deadline = event.start_date - timedelta(days=2)
            if now > cancel_deadline:
                return Response({
                    "status": "error",
                    "data": "You can only cancel an event at least 2 days before the start date",
                }, status=status.HTTP_400_BAD_REQUEST)
            reservation.status = "C"
            reservation.save()
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except ReservationCode.DoesNotExist:
            return Response({"status": "error", "data": "invalid reservation code"}, status=status.HTTP_400_BAD_REQUEST)


class EventFilter(filters.FilterSet):
    class Meta:
        model = Event
        fields = ["start_date", "end_date", "location", "organizer"]

    start_date = filters.DateTimeFilter(field_name="start_date", lookup_expr="gte")
    end_date = filters.DateTimeFilter(field_name="end_date", lookup_expr="lte")


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination
    filter_backends = [filters.DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["start_date", "title"]
    ordering = ["start_date"]

    def get_queryset(self):
        queryset = Event.objects.all()
        return queryset
    

class ReservationCodeDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        event_id = request.data.get("event_id")
        owner_id = request.data.get("owner_id")
        try:
            code = ReservationCode.objects.get(owner_id=owner_id, event_id=event_id)
            return Response({
                "status": "success",
                "data": code.code
            })
        except ReservationCode.DoesNotExist:
            return Response({
                "status": "error",
                "data": "no reservation code found"
            })


class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class RegisteredEventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    filter_backends = [filters.DjangoFilterBackend]

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if not user:
            raise ValueError({
                "status": "error",
                "data": "user not found"
            }, status=status.HTTP_404_NOT_FOUND)
        reservation_codes = ReservationCode.objects.filter(owner=user).select_related("event")
        return [reservation_code.event for reservation_code in reservation_codes]



