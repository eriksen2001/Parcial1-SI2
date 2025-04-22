import os
import json
import stripe
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Productos

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", os.getenv("STRIPE_SECRET_KEY"))


# Vista para cliente
@csrf_exempt
def getListProducts(request):
    productos = Productos.objects.filter(disponible=True)
    data = []
    for producto in productos:
        data.append({
            "id": producto.id,
            "nombre": producto.nombre,
            "precio": float(producto.precio),
            "imagen": producto.imagen,
            "disponible": producto.disponible,
            "stock": producto.stock
        })
    
    return JsonResponse(data, safe=False)


# Vista para Admin
@csrf_exempt
def getListProductsAdmin(request):
    productos = Productos.objects.all()
    data = []
    for producto in productos:
        data.append({
            "id": producto.id,
            "nombre": producto.nombre,
            "precio": float(producto.precio),
            "imagen": producto.imagen,
            "disponible": producto.disponible,
            "stock": producto.stock
        })

    return JsonResponse(data, safe=False)


# Vista para actualizar producto (Admin)
@csrf_exempt
def updateProduct(request, id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            n_precio = data.get('precio')
            n_stock = data.get('stock')

            producto = Productos.objects.get(id=id)

            if n_precio is not None:
                producto.precio = n_precio
            if n_stock is not None:
                producto.stock = n_stock

            producto.save()

            return JsonResponse({'mensaje': 'El producto ha sido actualizado'}, status=200)

        except Productos.DoesNotExist:
            return JsonResponse({'mensaje': 'Producto no encontrado'}, status=404)
        except Exception as e:
            print("❌ ERROR EN updateProduct:", str(e))
            return JsonResponse({'error': str(e)}, status=400) 

    return JsonResponse({'error': 'Método no permitido'}, status=405)


# ✅ Vista para crear PaymentIntent (Stripe)
@csrf_exempt
def create_payment_intent(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = float(data.get("amount", 0))

            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe usa centavos
                currency="BOB",
                payment_method_types=["card"]
            )

            return JsonResponse({"clientSecret": intent.client_secret})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)
