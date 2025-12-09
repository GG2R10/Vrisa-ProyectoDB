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
    tipo = models.CharField(max_length=25, choices=TIPOS, default='ciudadano')
    
    # Solicitudes y estados de aprobación
    solicita_investigador = models.BooleanField(default=False)
    solicita_autoridad = models.BooleanField(default=False)
    es_autoridad_aprobada = models.BooleanField(default=False)
    investigador_aprobado = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nombre', 'apellido']

class AdministradorInstitucion(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    institucion = models.ForeignKey('instituciones.Institucion', on_delete=models.CASCADE, related_name='admin_institucion')

class AdministradorSistema(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    super_admin = models.BooleanField(default=False)

class AdministradorEstacion(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    estacion = models.ForeignKey('estaciones.Estacion', on_delete=models.CASCADE, related_name='admin_estacion')

class Tecnico(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    estacion = models.ForeignKey('estaciones.Estacion', on_delete=models.CASCADE, related_name='tecnico_asignado')

class SolicitudInvestigador(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='solicitud_investigador')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    resuelto_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='solicitudes_investigador_resueltas'
    )
    
    def __str__(self):
        return f"Solicitud investigador - {self.usuario.email} ({self.estado})"

class SolicitudAutoridad(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='solicitud_autoridad')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    resuelto_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='solicitudes_autoridad_resueltas'
    )
    
    def __str__(self):
        return f"Solicitud autoridad - {self.usuario.email} ({self.estado})"
