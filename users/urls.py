from django.urls import path

from . import views

urlpatterns = [

    path('<str:activation_token>/', views.activation, name='activation'),

]
