from django.urls import path

from . import views

urlpatterns = [
    # /index/
    path('', views.index, name='index'),
    # /index/3/team/
    path('<int:player_id>/', views.player, name='player'),
    path('match/<int:match_id>/', views.match, name='match'),
    path('<int:team_id><int:activity_id>/', views.team, name='team'),
    # /index/6/result
]

