from estaciones.models import Estacion
from mediciones.models import Medicion
from alertas.models import Alerta
from django.db.models import Avg, Max, Min
from collections import defaultdict

# Variables a considerar
VARIABLES_METEO = ['velocidad_viento', 'direccion_viento', 'humedad', 'temperatura']
VARIABLES_CONC = ['NO2', 'PM25', 'SO2', 'O3', 'CO']


def obtener_mediciones(estaciones, fecha_inicio, fecha_fin):
    """
    Devuelve un dict por variable con todas las mediciones de las estaciones
    filtradas por rango de fechas, ordenadas por fecha.
    """
    datos = defaultdict(list)
    
    for est in estaciones:
        for sensor in est.sensores.all():
            mediciones = sensor.mediciones.filter(
                fecha_hora__range=(fecha_inicio, fecha_fin)
            ).order_by("fecha_hora")
            
            for m in mediciones:
                var_key = m.tipo.lower()
                datos[var_key].append({
                    "estacion": est.nombre,
                    "valor": float(m.valor),
                    "fecha": m.fecha_hora
                })
    
    return datos


def reporte_calidad_aire(estaciones, fecha_inicio, fecha_fin):
    """
    Genera un reporte de calidad del aire:
        - Promedio, max, min por variable
        - Lista de datos ordenada por fecha para gráficas
        - Metadatos adicionales por variable
    """
    mediciones = obtener_mediciones(estaciones, fecha_inicio, fecha_fin)
    resumen = {}

    for var, valores in mediciones.items():
        valores.sort(key=lambda x: x["fecha"])
        promedio = sum(v["valor"] for v in valores) / len(valores) if valores else 0
        max_valor = max(v["valor"] for v in valores) if valores else 0
        min_valor = min(v["valor"] for v in valores) if valores else 0

        resumen[var] = {
            "promedio": promedio,
            "max": max_valor,
            "min": min_valor,
            "datos": valores,
            "num_mediciones": len(valores),
            "fecha_inicio": valores[0]["fecha"] if valores else None,
            "fecha_fin": valores[-1]["fecha"] if valores else None
        }

    return {
        "tipo_reporte": "calidad_aire",
        "resumen": resumen,
        "estaciones": [e.nombre for e in estaciones]
    }


def reporte_tendencias(estaciones, fecha_inicio, fecha_fin):
    """
    Retorna tendencia de cada variable: lista de valores ordenada por fecha,
    y cambio relativo entre mediciones consecutivas (en porcentaje).
    """
    mediciones = obtener_mediciones(estaciones, fecha_inicio, fecha_fin)
    tendencias = {}

    for var, valores in mediciones.items():
        valores.sort(key=lambda x: x["fecha"])
        valores_con_tendencia = []

        for i, v in enumerate(valores):
            # Calcular cambio relativo respecto a la medición anterior
            if i == 0:
                cambio_relativo = 0  # primera medición no tiene cambio
            else:
                anterior = valores[i-1]["valor"]
                cambio_relativo = ((v["valor"] - anterior) / anterior * 100) if anterior != 0 else 0

            valores_con_tendencia.append({
                "estacion": v["estacion"],
                "fecha": v["fecha"],
                "valor": v["valor"],
                "cambio_relativo": cambio_relativo  # porcentaje
            })

        tendencias[var] = valores_con_tendencia

    return {
        "tipo_reporte": "tendencias",
        "tendencias": tendencias,
        "estaciones": [e.nombre for e in estaciones]
    }

def reporte_alertas(estaciones, fecha_inicio, fecha_fin):
    """
    Devuelve alertas generadas para las estaciones en el rango de fechas.
    """
    alertas_list = []

    for est in estaciones:
        for alerta in est.alertas.filter(fecha_emision__range=(fecha_inicio, fecha_fin)):
            alertas_list.append({
                "estacion": est.nombre,
                "tipo": alerta.tipo,
                "nivel": float(alerta.nivel_contaminacion),
                "descripcion": alerta.descripcion,
                "fecha": alerta.fecha_emision
            })

    return {
        "tipo_reporte": "alertas",
        "alertas": alertas_list
    }


def reporte_infraestructura(estaciones, fecha_inicio=None, fecha_fin=None):
    """
    Reporte de estado de infraestructura y mantenimiento de estaciones.
    """
    infra_data = []

    for est in estaciones:
        infra_data.append({
            "estacion": est.nombre,
            "documento_certificado": bool(est.documento_certificado),
            "tecnico_asignado": est.tecnico.nombre if est.tecnico else None
        })

    return {
        "tipo_reporte": "infraestructura",
        "infraestructura": infra_data,
        "estaciones": [e.nombre for e in estaciones]
    }
