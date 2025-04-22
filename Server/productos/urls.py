from django.urls import path
from . import views

urlpatterns = [
    path('getproducts/', views.getListProducts),
    path('getallproducts/', views.getListProductsAdmin),
    path('update/<int:id>/', views.updateProduct),
    path('payment-intent/', views.create_payment_intent),
]