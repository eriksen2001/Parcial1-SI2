from django.urls import path
from . import views

urlpatterns = [
    path('payment/create-intent/', views.crear_payment_intent)
]
