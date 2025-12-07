from django.db import models
from django.contrib.postgres.fields import JSONField  # Por PostgreSQL
from estaciones.models import Estacion 

class Sensor(models.Model):
    TIPO_CHOICES = [
        ('variables', 'Variables Meteorológicas'),
        ('concentraciones', 'Concentraciones de Material Particulado'),
        ('todos', 'Variables y Concentraciones'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    unidad_de_medida = models.CharField(max_length=20)
    fecha_calibracion = models.DateField()
    estacion = models.ForeignKey(
        Estacion, 
        on_delete=models.CASCADE, 
        related_name='sensores'
    )

    # Lista de variables que realmente mide
    variables_medibles = models.JSONField(default=list)  # ej: ["NO2","PM25"]

    def __str__(self):
        return f"{self.tipo} ({self.estacion.nombre})"

