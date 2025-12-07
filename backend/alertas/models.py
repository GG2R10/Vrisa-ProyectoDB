from django.db import models
from estaciones.models import Estacion

class Alerta(models.Model):
    TIPO_CHOICES = [
        ('critica', 'Crítica'),
        ('advertencia', 'Advertencia'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    fecha_emision = models.DateTimeField(auto_now_add=True)
    nivel_contaminacion = models.DecimalField(max_digits=7, decimal_places=2)
    descripcion = models.TextField()
    estacion = models.ForeignKey(
        Estacion,
        on_delete=models.CASCADE,
        related_name='alertas'
    )

    def __str__(self):
        return f"{self.tipo} - {self.estacion.nombre} ({self.fecha_emision.date()})"
