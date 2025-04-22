from django.shortcuts import render
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

# Create your views here.

@csrf_exempt
def crear_payment_intent(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = data.get('amount')

            if not amount:
                return JsonResponse({'error': 'Amount requerido'}, status=400)

            intent = stripe.PaymentIntent.create(
                amount = int(amount),
                currency = 'bob',
                payment_method_types = ['card'],
            )

            return JsonResponse({'clientSecret': intent.client_secret})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

