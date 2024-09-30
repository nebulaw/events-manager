from rest_framework import serializers
from .models import User, Event, ReservationCode
import string
import random


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "phone_number", "profile_picture"]


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "name", "phone_number", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationCode
        fields = ["code", "owner", "event"]

    def create(self, validated_data):
        owner = validated_data["owner"]
        event = validated_data["event"]
        code = validated_data["code"]
        reservation_code = ReservationCode.objects.create(code=code, owner=owner, event=event)
        return reservation_code


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "start_date", "end_date", "thumbnail", "location", "organizer"]

class ReservationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationCode
        fields = ["code", "owner", "client"]

