from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class Usuario(AbstractUser):
    # username, password, email ya están en AbstractUser
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    
    TIPOS = [
        ('ciudadano', 'Ciudadano'),
        ('investigador', 'Investigador'),
        ('admin_sistema', 'Administrador del Sistema'),
        ('admin_institucion', 'Administrador de Institución'),
        ('admin_estacion', 'Administrador de Estación'),
        ('tecnico', 'Técnico'),
        ('autoridad', 'Autoridad Ambiental')
    ]
    tipo = models.CharField(max_length=25, choices=TIPOS)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nombre', 'apellido']

class AdministradorInstitucion(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    institucion = models.ForeignKey('instituciones.Institucion', on_delete=models.CASCADE)

class AdministradorSistema(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    super_admin = models.BooleanField(default=False)

class AdministradorEstacion(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    estacion = models.ForeignKey('estaciones.Estacion', on_delete=models.CASCADE)

class Tecnico(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    estacion = models.ForeignKey('estaciones.Estacion', on_delete=models.CASCADE)