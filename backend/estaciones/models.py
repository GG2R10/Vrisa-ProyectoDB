from django.db import models
from django.conf import settings
from instituciones.models import Institucion

class Estacion(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)

    # Ubicación geográfica
    ubicacion_latitud = models.DecimalField(max_digits=9, decimal_places=6)
    ubicacion_longitud = models.DecimalField(max_digits=9, decimal_places=6)
    ubicacion_referencia = models.CharField(max_length=255, null=True, blank=True)

    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name='estaciones')

    # Usuario que hizo la solicitud
    creador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='estaciones_creadas'
    )

    tecnico = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="estaciones_tecnico"
    )

    # Documentos de certificación/mantenimiento
    documento_certificado = models.FileField(upload_to='certificados_estaciones/', null=True, blank=True)

    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('pendiente', 'Pendiente'),
            ('aprobada', 'Aprobada'),
            ('rechazada', 'Rechazada'),
        ],
        default='pendiente'
    )

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.estado_validacion})"
