from django.urls import path
from . import views

urlpatterns = [  # here remarks/name_of_page directories lies
    path('', views.index, name='index'),
]
