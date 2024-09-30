from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from cloudinary.models import CloudinaryField
import uuid
import random
import string

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Email is a required field")
        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        kwargs.setdefault("is_superuser", True)
        kwargs.setdefault("is_staff", True)
        if kwargs.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if kwargs.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        return self.create_user(email, password, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        ordering=('-create_date',)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone_number"]
    objects = UserManager()

    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    phone_number = models.CharField(unique=True, max_length=9)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    profile_picture = CloudinaryField("Image", format="jpg", null=True, blank=True)
    registered_events = models.ManyToManyField('Event', related_name="registered_users", blank=True)
    past_events = models.ManyToManyField('Event', related_name="past_users", blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"<Client {self.email}>"


class Event(models.Model):
    class Meta:
        ordering = ('-create_date',)

    STATUS_CHOICES = {
        "U": "upcoming",
        "P": "past",
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    thumbnail = CloudinaryField("Thumbnail", format="jpg")
    location = models.CharField(max_length=100)
    organizer = models.CharField(max_length=40)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="U")
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"<Event {self.title} by {self.organizer}>"


class ReservationCode(models.Model):
    class Meta:
        ordering=('-create_date',)

    STATUS_CHOICES = {
        "A": "active",
        "C": "cancelled",
        "E": "expired",
    }

    owner = models.ForeignKey(User, default=uuid.uuid4, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, default=uuid.uuid4, on_delete=models.CASCADE)
    code = models.CharField(max_length=10, unique=True)
    status = models.CharField(choices=STATUS_CHOICES, default="active")
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"<ReservationCode {self.owner} on {self.event}>"

    def generate_code(self):
        return "".join(random.choices(string.ascii_uppercase + string.digits, k=10))

