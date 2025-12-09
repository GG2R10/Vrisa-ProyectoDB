"""
Script para debuggear Sensores y API
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from django.test import RequestFactory
from sensores.views import SensorListCreateView
from estaciones.models import Estacion
from sensores.models import Sensor

print("=" * 70)
print("DEBUG: SENSORES API")
print("=" * 70)

# 1. Verificar Datos en DB
print("\n1. Verificando datos en Base de Datos...")
total_sensores = Sensor.objects.count()
print(f"   Total Sensores en DB: {total_sensores}")

estacion = Estacion.objects.first()
if not estacion:
    print("   ❌ No hay estaciones en la DB")
    exit()

print(f"   Estación de prueba: {estacion.nombre} (ID: {estacion.id})")
sensores_estacion = Sensor.objects.filter(estacion=estacion)
print(f"   Sensores asociados en DB: {sensores_estacion.count()}")
for s in sensores_estacion:
    print(f"     - ID: {s.id}, Tipo: {s.tipo_sensor}, Estado: {s.estado}")

if sensores_estacion.count() == 0:
    print("   ⚠️ La estación no tiene sensores. Probando buscar una que sí tenga...")
    estacion_con_sensores = Estacion.objects.filter(sensores__isnull=False).distinct().first()
    if estacion_con_sensores:
        estacion = estacion_con_sensores
        print(f"   Cambio a Estación: {estacion.nombre} (ID: {estacion.id}) - Tiene {estacion.sensores.count()} sensores")
    else:
        print("   ❌ Ninguna estación tiene sensores.")

# 2. Verificar API
print("\n2. Verificando API (/sensores/?estacion=ID)...")
factory = RequestFactory()
view = SensorListCreateView.as_view()

url = f'/sensores/?estacion={estacion.id}'
print(f"   Request GET: {url}")
request = factory.get(url)
response = view(request)

print(f"   Status Code: {response.status_code}")
if response.status_code == 200:
    data = response.data
    results = data if isinstance(data, list) else data.get('results', [])
    print(f"   Resultados API: {len(results)}")
    
    if len(results) > 0:
        print("   ✅ API devuelve datos correctamente.")
        print("   Ejemplo de dato:")
        print(json.dumps(results[0], indent=2, inherit=True, default=str))
    else:
        if sensores_estacion.count() > 0:
            print("   ❌ API devuelve lista vacía pero DB tiene datos! Revisar filtros en View.")
        else:
            print("   ⚠️ API devuelve lista vacía (correcto, no hay datos).")
else:
    print(f"   ❌ Error en API: {response.data}")

print("\n" + "=" * 70)
