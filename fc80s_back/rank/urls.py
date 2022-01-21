from django.urls import path

from . import views

urlpatterns = [
    # /rank/
    path('', views.rank, name='rank'),
    # /rank/upload
    path('upload/', views.upload, name='upload'),
]
