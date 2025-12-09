"""
Script para probar que los reportes funcionan con los datos creados
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from estaciones.models import Estacion
from reportes.utils import (
    reporte_calidad_aire,
    reporte_tendencias,
    reporte_alertas,
    reporte_infraestructura
)
from django.utils import timezone
from datetime import timedelta
import json

print("=" * 70)
print("PRUEBA DE FUNCIONALIDAD DE REPORTES")
print("=" * 70)

# Obtener todas las estaciones
estaciones = list(Estacion.objects.all())
print(f"\n✓ Estaciones disponibles: {len(estaciones)}")

# Definir rango de fechas (últimos 30 días)
fecha_fin = timezone.now()
fecha_inicio = fecha_fin - timedelta(days=30)

print(f"✓ Rango de fechas: {fecha_inicio.date()} a {fecha_fin.date()}")

# Probar cada tipo de reporte
print("\n" + "=" * 70)
print("1. REPORTE DE CALIDAD DEL AIRE")
print("=" * 70)
try:
    reporte_ca = reporte_calidad_aire(estaciones, fecha_inicio, fecha_fin)
    print(f"✓ Reporte generado exitosamente")
    print(f"  - Tipo: {reporte_ca['tipo_reporte']}")
    print(f"  - Variables incluidas: {len(reporte_ca['resumen'])}")
    for var, datos in list(reporte_ca['resumen'].items())[:3]:
        print(f"    • {var}: {datos['num_mediciones']} mediciones")
        print(f"      Promedio: {datos['promedio']:.2f}, Min: {datos['min']:.2f}, Max: {datos['max']:.2f}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
print("2. REPORTE DE TENDENCIAS")
print("=" * 70)
try:
    reporte_tend = reporte_tendencias(estaciones, fecha_inicio, fecha_fin)
    print(f"✓ Reporte generado exitosamente")
    print(f"  - Tipo: {reporte_tend['tipo_reporte']}")
    print(f"  - Variables con tendencias: {len(reporte_tend['tendencias'])}")
    for var, datos in list(reporte_tend['tendencias'].items())[:3]:
        print(f"    • {var}: {len(datos)} puntos de datos")
        if len(datos) > 0:
            print(f"      Último cambio relativo: {datos[-1]['cambio_relativo']:.2f}%")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
print("3. REPORTE DE ALERTAS")
print("=" * 70)
try:
    reporte_alert = reporte_alertas(estaciones, fecha_inicio, fecha_fin)
    print(f"✓ Reporte generado exitosamente")
    print(f"  - Tipo: {reporte_alert['tipo_reporte']}")
    print(f"  - Total de alertas: {len(reporte_alert['alertas'])}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
print("4. REPORTE DE INFRAESTRUCTURA")
print("=" * 70)
try:
    reporte_infra = reporte_infraestructura(estaciones)
    print(f"✓ Reporte generado exitosamente")
    print(f"  - Tipo: {reporte_infra['tipo_reporte']}")
    print(f"  - Estaciones incluidas: {len(reporte_infra['infraestructura'])}")
    for info in reporte_infra['infraestructura']:
        print(f"    • {info['estacion']}")
        print(f"      Certificado: {'Sí' if info['documento_certificado'] else 'No'}")
        print(f"      Técnico: {info['tecnico_asignado'] or 'No asignado'}")
except Exception as e:
    print(f"❌ Error: {e}")

# Probar reporte de una sola estación
print("\n" + "=" * 70)
print("5. REPORTE DE CALIDAD DEL AIRE (ESTACIÓN INDIVIDUAL)")
print("=" * 70)
try:
    primera_estacion = [estaciones[0]]
    reporte_individual = reporte_calidad_aire(primera_estacion, fecha_inicio, fecha_fin)
    print(f"✓ Reporte generado para: {estaciones[0].nombre}")
    print(f"  - Variables incluidas: {len(reporte_individual['resumen'])}")
    total_mediciones = sum(d['num_mediciones'] for d in reporte_individual['resumen'].values())
    print(f"  - Total de mediciones: {total_mediciones}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
print("✓ PRUEBA DE REPORTES COMPLETADA")
print("=" * 70)
print("\n💡 Los reportes están listos para ser consumidos por el frontend")
print("💡 Puedes probar los endpoints de la API ahora")
