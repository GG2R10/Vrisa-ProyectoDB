from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Medicion
from alertas.models import Alerta
from datetime import datetime

# Definir umbrales por variable
UMBRAL_CONTAMINACION = {
    'NO2': 100,    # ejemplo en µg/m³
    'PM25': 50,
    'SO2': 80,
    'O3': 120,
    'CO': 10,
}

UMBRAL_METEO = {
    # Por ejemplo, velocidad de viento alta que pueda ser crítica
    'velocidad_viento': 30,  # km/h
}

@receiver(post_save, sender=Medicion)
def crear_alerta_automatica(sender, instance, created, **kwargs):
    if not created:
        return  # solo actuar cuando se crea la medición

    variable = instance.tipo
    valor = instance.valor
    estacion = instance.sensor.estacion

    alerta_tipo = None
    nivel_contaminacion = valor

    # Verificar si la variable es de contaminante
    if variable in UMBRAL_CONTAMINACION and valor >= UMBRAL_CONTAMINACION[variable]:
        alerta_tipo = 'critica'
        descripcion = f"Nivel crítico detectado: {variable} = {valor}"
    # Verificar si la variable es meteorológica (ejemplo velocidad de viento)
    elif variable in UMBRAL_METEO and valor >= UMBRAL_METEO[variable]:
        alerta_tipo = 'advertencia'
        descripcion = f"Condición meteorológica extrema: {variable} = {valor}"

    # Si se superó algún umbral, crear la alerta
    if alerta_tipo:
        Alerta.objects.create(
            tipo=alerta_tipo,
            nivel_contaminacion=nivel_contaminacion,
            descripcion=descripcion,
            estacion=estacion
        )
