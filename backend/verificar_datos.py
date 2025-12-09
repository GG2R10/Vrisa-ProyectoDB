"""
Script para verificar que los sensores y mediciones fueron creados
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from mediciones.models import Medicion
from sensores.models import Sensor
from estaciones.models import Estacion
from django.db.models import Count

print("=" * 60)
print("VERIFICACIÓN DE DATOS CREADOS")
print("=" * 60)

# Contar estaciones
total_estaciones = Estacion.objects.count()
print(f"\n✓ Total estaciones: {total_estaciones}")

# Contar sensores
total_sensores = Sensor.objects.count()
print(f"✓ Total sensores: {total_sensores}")

# Mostrar sensores por estación
print("\nSensores por estación:")
for estacion in Estacion.objects.all():
    sensores = estacion.sensores.all()
    print(f"  {estacion.nombre}: {sensores.count()} sensores")
    for sensor in sensores:
        print(f"    - Tipo: {sensor.tipo}, Variables: {', '.join(sensor.variables_medibles)}")

# Contar mediciones
total_mediciones = Medicion.objects.count()
print(f"\n✓ Total mediciones: {total_mediciones}")

# Mediciones por tipo
print("\nMediciones por tipo de variable:")
mediciones_por_tipo = Medicion.objects.values('tipo').annotate(
    count=Count('tipo')
).order_by('-count')

for m in mediciones_por_tipo:
    print(f"  {m['tipo']}: {m['count']} mediciones")

# Verificar rango de fechas
if total_mediciones > 0:
    primera = Medicion.objects.order_by('fecha_hora').first()
    ultima = Medicion.objects.order_by('-fecha_hora').first()
    print(f"\nRango de fechas de mediciones:")
    print(f"  Primera: {primera.fecha_hora}")
    print(f"  Última: {ultima.fecha_hora}")

print("\n" + "=" * 60)
print("✓ VERIFICACIÓN COMPLETADA")
print("=" * 60)
