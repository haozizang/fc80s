from django.urls import path

from . import views

urlpatterns = [
    # /activity/3/5/
    path('create/', views.create, name='create'),
    # TODO: restrict to GET request
    path('get_team_acts/', views.getTeamActs, name='getTeamActs')
]
