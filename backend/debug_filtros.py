"""
Script para debuggear filtros de API
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from django.test import RequestFactory
from mediciones.views import MedicionListCreateView
from estaciones.models import Estacion

print("=" * 70)
print("DEBUG: FILTROS DE API")
print("=" * 70)

factory = RequestFactory()
view = MedicionListCreateView.as_view()

# 1. Prueba sin filtros
print("\n1. Prueba sin filtros (esperado: todas las mediciones)")
request = factory.get('/mediciones/')
response = view(request)
data = response.data
print(f"   Resultados: {len(data) if isinstance(data, list) else len(data['results']) if 'results' in data else 'Error'}")

# 2. Prueba filtrar por Estación
estacion = Estacion.objects.first()
if estacion:
    print(f"\n2. Filtrar por Estación: {estacion.nombre} (ID: {estacion.id})")
    request = factory.get(f'/mediciones/?estacion={estacion.id}')
    response = view(request)
    data = response.data
    # Convertir a lista si es paginado
    results = data['results'] if 'results' in data else data
    print(f"   Resultados: {len(results)}")
    # Validar
    if len(results) > 0:
        malos = [m for m in results if m['sensor'] not in [s.id for s in estacion.sensores.all()]]
        if not malos:
            print("   ✅ Todos los resultados pertenecen a la estación correcta")
        else:
            print(f"   ❌ Hay mediciones de otras estaciones: {len(malos)}")

# 3. Prueba filtrar por Tipo (Variable)
tipo = "PM2.5"
print(f"\n3. Filtrar por Tipo: {tipo}")
request = factory.get(f'/mediciones/?tipo={tipo}')
response = view(request)
data = response.data
results = data['results'] if 'results' in data else data
print(f"   Resultados: {len(results)}")
if len(results) > 0:
    # Nota: la API devuelve 'tipo' serializado, comparar con eso
    malos = [m for m in results if m['tipo'] != tipo]
    if not malos:
        print(f"   ✅ Todos los resultados son de tipo {tipo}")
    else:
        print(f"   ❌ Hay mediciones de otros tipos: {len(malos)}")

print("\n" + "=" * 70)
print("DEBUG COMPLETADO")
print("=" * 70)
