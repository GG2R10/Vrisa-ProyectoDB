from django.db import models
from django.conf import settings

class Institucion(models.Model):

    ESTADOS_VALIDACION = [
        ('pendiente', 'Pendiente'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]

    # Creador de la institucion (Admin de institución)
    creador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='instituciones_creadas'
    )

    nombre = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to="logos_instituciones/", null=True, blank=True)
    direccion = models.CharField(max_length=255)
    
    # Colores en formato HEX (#112233)
    color_primario = models.CharField(max_length=7, default="#000000")
    color_secundario = models.CharField(max_length=7, default="#FFFFFF")
    
    estado_validacion = models.CharField(
        max_length=20,
        choices=ESTADOS_VALIDACION,
        default='pendiente'
    )

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.estado_validacion})"
