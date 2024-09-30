from django.contrib import admin
from django.contrib.auth.models import Group
# from django.contrib.auth.admin import UserAdmin
from .models import User, Event, ReservationCode


# @admin.register(Event)
# class EventAdmin(admin.ModelAdmin):
#     list_display = ["title", "start_date", "end_date", "location", "organizer"]
#     search_fields = ["title", "location", "organizer"]
#     list_filter = ["start_date", "end_date", "status"]

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ["name", "email", "phone_number"]
#     search_fields = ["email", "name"]
#     list_filter = ["registered_events"]

# @admin.register(ReservationCode)
# class ReservationCodeAdmin(admin.ModelAdmin):
#     list_display = ["code", "owner", "event", "create_date", "status"]
#     list_filter = ["status"]

admin.site.register(User)
admin.site.register(Event)
admin.site.register(ReservationCode)
admin.site.unregister(Group)