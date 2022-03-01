from django.urls import path
from .views import indexView  # the view responsible for the frontend

urlpatterns = [
    path('', indexView),  # add the view to the url
    path('activate/<str:activation_token>', indexView),  # add the view to the url
    path('password-reset/', indexView),  # add the view to the url
    path('password-reset/<str:activation_token>', indexView),  # add the view to the url
]