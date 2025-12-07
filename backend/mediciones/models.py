from django.db import models
from sensores.models import Sensor

class TipoMedicion(models.TextChoices):
    VELOCIDAD_VIENTO = 'velocidad_viento'
    DIRECCION_VIENTO = 'direccion_viento'
    HUMEDAD = 'humedad'
    TEMPERATURA = 'temperatura'
    NO2 = 'NO2'
    PM25 = 'PM25'
    SO2 = 'SO2'
    O3 = 'O3'
    CO = 'CO'

class Medicion(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='mediciones')
    tipo = models.CharField(max_length=20, choices=TipoMedicion.choices)
    valor = models.DecimalField(max_digits=7, decimal_places=3)
    fecha_hora = models.DateTimeField()

    def __str__(self):
        return f"{self.sensor.nombre} - {self.tipo}: {self.valor} ({self.fecha_hora})"
