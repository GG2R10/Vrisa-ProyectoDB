"""
Script para debuggear el problema de mediciones y fechas
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from mediciones.models import Medicion
from sensores.models import Sensor
from estaciones.models import Estacion
from django.db.models import Count

print("=" * 70)
print("DEBUG: MEDICIONES Y FECHAS")
print("=" * 70)

# 1. Contar mediciones totales
total_mediciones = Medicion.objects.count()
print(f"\n1. Total de mediciones en la DB: {total_mediciones}")

# 2. Mediciones por estación
print("\n2. Mediciones por estación:")
for estacion in Estacion.objects.all()[:5]:
    # Contar sensores
    num_sensores = estacion.sensores.count()
    
    # Contar mediciones a través de sensores
    num_mediciones = Medicion.objects.filter(sensor__estacion=estacion).count()
    
    print(f"  {estacion.nombre}:")
    print(f"    - Sensores: {num_sensores}")
    print(f"    - Mediciones: {num_mediciones}")

# 3. Mediciones por sensor
print("\n3. Mediciones por sensor (primeros 5):")
for sensor in Sensor.objects.all()[:5]:
    num_mediciones = sensor.mediciones.count()
    variables = sensor.variables_medibles
    print(f"  Sensor {sensor.id} ({sensor.tipo}):")
    print(f"    - Variables: {variables}")
    print(f"    - Mediciones: {num_mediciones}")
    print(f"    - Esperadas: {len(variables) * 50}")

# 4. Verificar formato de fechas
print("\n4. Verificar formato de fechas (primeras 5 mediciones):")
for medicion in Medicion.objects.all()[:5]:
    print(f"  ID: {medicion.id}")
    print(f"    - Tipo: {medicion.tipo}")
    print(f"    - Valor: {medicion.valor}")
    print(f"    - Fecha (objeto): {medicion.fecha_hora}")
    print(f"    - Fecha (ISO): {medicion.fecha_hora.isoformat()}")
    print(f"    - Sensor: {medicion.sensor.id}")

# 5. Verificar mediciones duplicadas
print("\n5. Verificar mediciones duplicadas:")
duplicados = Medicion.objects.values('sensor', 'tipo', 'fecha_hora').annotate(
    count=Count('id')
).filter(count__gt=1)

if duplicados.exists():
    print(f"  ⚠️  Encontradas {duplicados.count()} combinaciones duplicadas")
    for dup in duplicados[:5]:
        print(f"    - Sensor {dup['sensor']}, Tipo {dup['tipo']}, Fecha {dup['fecha_hora']}: {dup['count']} veces")
else:
    print("  ✓ No hay duplicados")

# 6. Verificar estructura del serializer
print("\n6. Simular serialización de medición:")
medicion = Medicion.objects.first()
if medicion:
    serialized = {
        'id': medicion.id,
        'sensor': medicion.sensor.id,
        'tipo': medicion.tipo,
        'valor': float(medicion.valor),
        'fecha_hora': medicion.fecha_hora.isoformat(),
    }
    print(f"  Medición serializada: {serialized}")

print("\n" + "=" * 70)
print("DEBUG COMPLETADO")
print("=" * 70)
