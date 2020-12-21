from django.urls import path

from . import views

urlpatterns = [
    # /index/
    path('', views.index, name='index'),
    # /index/24/
    path('<int:detail_id>', views.detail, name='detail'),
    # /index/3/question/
    path('<int:detail_id>/question/', views.question, name='question'),
    # /index/6/result
    path('<int:detail_id>/result/', views.result, name='result'),
]

