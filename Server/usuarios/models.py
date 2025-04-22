from django.db import models

class Usuarios(models.Model):
    nombre = models.CharField(max_length=55)
    correo = models.CharField(unique=True, max_length=50)
    password = models.TextField()
    rol = models.CharField(max_length=10)

    class Meta:
        managed = True
        db_table = 'usuarios'


class Bitacora(models.Model):
    usuario = models.ForeignKey('usuarios.Usuarios', on_delete=models.DO_NOTHING, db_column='usuario_id')
    fecha_hora = models.DateTimeField()
    ip = models.CharField(max_length=50)
    accion = models.CharField(max_length=20)

    class Meta:
        db_table = 'bitacora'
        managed = False  # Muy importante para que Django NO la cree ni la migre



