from django.shortcuts import render

import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import os
import firebase_admin
from firebase_admin import credentials, messaging
from django.http import JsonResponse

# Create your views here.

# Inicializar Firebase solo una vez usando la variable de entorno FIREBASE_JSON
if not firebase_admin._apps:
    firebase_config = os.environ.get("FIREBASE_JSON")

    if not firebase_config:
        raise Exception("⚠️ La variable FIREBASE_JSON no está configurada en Railway")

    cred_dict = json.loads(firebase_config)  # convierte el string en dict
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)

@csrf_exempt
def enviar_notificacion(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            token = data.get('token')
            titulo = data.get('titulo', 'Sin título')
            mensaje = data.get('mensaje', 'Sin mensaje')

            if not token:
                return JsonResponse({'success': False, 'error': 'Token no proporcionado'}, status=400)

            message = messaging.Message(
                notification=messaging.Notification(
                    title=titulo,
                    body=mensaje
                ),
                token=token
            )

            response = messaging.send(message)
            return JsonResponse({'success': True, 'firebase_response': response})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
