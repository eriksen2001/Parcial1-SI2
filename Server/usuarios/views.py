from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from .models import Usuarios
from .models import Bitacora
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone


import json
import jwt 


# Create your views here.

def getIP(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    return ip

@csrf_exempt
def user_login(request):
    data = json.loads(request.body)

    correo = data.get('email')
    password = data.get('password')

    try:
        usuario = Usuarios.objects.get(correo=correo)
    except Usuarios.DoesNotExist:
        return JsonResponse({'error': 'El correo no existe'}, status=401)
    if not check_password(password, usuario.password):
        return JsonResponse({'error': 'La contraseña es incorrecta'}, status=401)

    
    # Registramos en bitacora
    Bitacora.objects.create(
        usuario = usuario,
        fecha_hora = timezone.now(),
        ip = getIP(request),
        accion = 'login'
    )

    token = generar_token(usuario)

    return JsonResponse({
        'token': token,
        'user': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'rol': usuario.rol,
        }
    }, status=200)


@csrf_exempt
def user_register(request):

    data = json.loads(request.body)

    nombre = data.get('name')
    correo = data.get('email')
    password = data.get('password')
    rol = data.get('rol') or 'Cliente'

    
    #creamos al usuario
    usuario = Usuarios.objects.create(
        nombre = nombre,
        correo = correo,
        password = make_password(password),
        rol = rol,
    )

    # Registramos en bitacora
    Bitacora.objects.create(
        usuario=usuario,
        fecha_hora=timezone.now(),
        ip=getIP(request),
        accion='registro'
    )


    return JsonResponse({'message': 'Usuario creado exitosamente'}, status=201)


@csrf_exempt
def ver_bitacora(request):
    logs = Bitacora.objects.select_related('usuario').all().order_by('-fecha_hora')
    data = [
        {
            "usuario": log.usuario.nombre,
            "fecha_hora": log.fecha_hora.isoformat(),
            "ip": log.ip,
            "accion": log.accion,
        }
        for log in logs
    ]

    return JsonResponse(data, safe=False)


# funciones auxiliares

def generar_token(usuario):
    payload = {
        'id': usuario.id,
        'rol': usuario.rol,
        'exp': settings.JWT_EXP_DELTA_SECONDS,
        'iat': datetime.utcnow()
    }

    token = jwt.encode(payload, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)
    return token

"""
def getIP(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    return ip
"""



