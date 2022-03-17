from django.urls import path

from . import views

urlpatterns = [
    # /activity/3/5/
    path('create/', views.createActivity, name='createActivity'),
]
