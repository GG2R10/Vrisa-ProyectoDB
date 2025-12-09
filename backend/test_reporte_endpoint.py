"""
Script para probar el endpoint de reportes después de los fixes
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import force_authenticate
from usuarios.models import Usuario
from reportes.views import ReporteGeneralView
import json

print("=" * 70)
print("PRUEBA DE ENDPOINT DE REPORTES")
print("=" * 70)

# Crear un request simulado
factory = RequestFactory()

# Obtener un usuario de prueba
try:
    user = Usuario.objects.filter(tipo='ciudadano').first()
    if not user:
        print("❌ No hay usuarios ciudadanos en la base de datos")
        print("   Ejecuta crear_seeds.py primero")
        exit(1)
    
    print(f"\n✓ Usuario de prueba: {user.email} ({user.tipo})")
    
    # Crear request GET con parámetros
    request = factory.get('/reportes/general/', {
        'tipo_reporte': 'calidad_aire',
        'fecha_inicio': '2024-11-08',
        'fecha_fin': '2024-12-08'
    })
    
    # Autenticar el request
    force_authenticate(request, user=user)
    
    # Llamar a la vista
    view = ReporteGeneralView.as_view()
    response = view(request)
    
    print(f"\n✓ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✓ Reporte generado exitosamente")
        data = response.data
        print(f"\n  Tipo: {data.get('tipo')}")
        print(f"  Estaciones: {len(data.get('estaciones', []))}")
        print(f"  Fecha inicio: {data.get('fecha_inicio')}")
        print(f"  Fecha fin: {data.get('fecha_fin')}")
        
        if 'datos' in data:
            datos = data['datos']
            print(f"\n  Datos del reporte:")
            print(f"    Tipo reporte: {datos.get('tipo_reporte')}")
            
            if 'resumen' in datos:
                resumen = datos['resumen']
                print(f"    Variables encontradas: {len(resumen)}")
                for var, info in list(resumen.items())[:3]:
                    print(f"\n    Variable: {var}")
                    print(f"      Mediciones: {info.get('num_mediciones', 0)}")
                    print(f"      Promedio: {info.get('promedio', 0):.2f}")
                    print(f"      Min: {info.get('min', 0):.2f}")
                    print(f"      Max: {info.get('max', 0):.2f}")
        
        # Verificar que el JSON es serializable
        try:
            json_str = json.dumps(data)
            print(f"\n✓ El response es serializable a JSON ({len(json_str)} caracteres)")
        except Exception as e:
            print(f"\n❌ Error al serializar a JSON: {e}")
    else:
        print(f"❌ Error en el reporte")
        print(f"   Response: {response.data}")

except Exception as e:
    print(f"\n❌ Error durante la prueba: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("PRUEBA COMPLETADA")
print("=" * 70)
