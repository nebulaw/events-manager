from django.urls import path
from .views import SingUpView, SignInView, SignOutView, UserDetailView, RegisterOnEventView, CancelEventView, EventListView, EventDetailView, RegisteredEventListView, ReservationCodeDetailView

urlpatterns = [
    path("sign-up/", SingUpView.as_view(), name="sing-up"),
    path("sign-in/", SignInView.as_view(), name="sign-in"),
    path("sign-out/", SignOutView.as_view(), name="sign-out"),
    path("register/", RegisterOnEventView.as_view(), name="register-on-event"),
    path("code/", ReservationCodeDetailView.as_view(), name="reservation-code-detail"),
    path("cancel/", CancelEventView.as_view(), name="cancel-event"),
    path("events/", EventListView.as_view(), name="event-list"),
    path("registered-events/", RegisteredEventListView.as_view(), name="registered-events"),
    path("events/<str:id>", EventDetailView.as_view(), name="event-detail"),
    path("users/<str:id>", UserDetailView.as_view(), name="user-detail")
]
