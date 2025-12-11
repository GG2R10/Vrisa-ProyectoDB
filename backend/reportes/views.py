from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ReporteRequestSerializer
from .permissions import PuedeGenerarReportes
from estaciones.models import Estacion
from .utils import reporte_calidad_aire, reporte_tendencias, reporte_alertas, reporte_infraestructura
from django.http import HttpResponse, JsonResponse
import json

class EstacionesDisponiblesView(APIView):
    """
    Devuelve la lista de estaciones que el usuario puede usar para reportes detallados
    """
    def get(self, request):
        user = request.user

        if user.tipo == "ciudadano":
            estaciones = Estacion.objects.filter(estado_validacion="aprobada")
        elif user.tipo == "admin_institucion":
            estaciones = Estacion.objects.filter(institucion=user.administradorinstitucion.institucion)
        elif user.tipo == "admin_estacion":
            estaciones = Estacion.objects.filter(id=user.administradorestacion.estacion.id)
        elif user.tipo == "tecnico":
            estaciones = Estacion.objects.filter(id=user.tecnico.estacion.id)
        elif user.tipo in ["investigador", "autoridad"]:
            estaciones = Estacion.objects.filter(estado_validacion="aprobada")
        else:
            return Response([], status=403)

        datos = [{"id": e.id, "nombre": e.nombre} for e in estaciones]
        return Response(datos)

class ReporteGeneralView(APIView):
    permission_classes = [PuedeGenerarReportes]

    def get(self, request):
        from datetime import datetime
        from django.utils import timezone
        
        estaciones = Estacion.objects.filter(estado_validacion="aprobada")
        tipo = request.query_params.get("tipo_reporte", "calidad_aire")
        fecha_inicio_str = request.query_params.get("fecha_inicio")
        fecha_fin_str = request.query_params.get("fecha_fin")

        # Parsear fechas de string a datetime
        try:
            if fecha_inicio_str:
                fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio_str, "%Y-%m-%d"))
            else:
                # Por defecto, últimos 30 días
                fecha_inicio = timezone.now() - timezone.timedelta(days=30)
            
            if fecha_fin_str:
                fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin_str, "%Y-%m-%d"))
                # Ajustar a fin del día
                fecha_fin = fecha_fin.replace(hour=23, minute=59, second=59)
            else:
                fecha_fin = timezone.now()
        except ValueError as e:
            return Response({
                "error": f"Formato de fecha inválido. Use YYYY-MM-DD. Detalle: {str(e)}"
            }, status=400)

        # Ejecutamos el reporte correspondiente
        try:
            contenido = {
                "calidad_aire": reporte_calidad_aire,
                "tendencias": reporte_tendencias,
                "alertas": reporte_alertas,
                "infraestructura": reporte_infraestructura
            }[tipo](estaciones, fecha_inicio, fecha_fin)
        except Exception as e:
            return Response({
                "error": f"Error al generar reporte: {str(e)}"
            }, status=500)

        return Response({
            "tipo": tipo,
            "estaciones": [e.id for e in estaciones],
            "fecha_inicio": fecha_inicio_str,
            "fecha_fin": fecha_fin_str,
            "datos": contenido
        }, status=200)


class ReporteDetalladoView(APIView):
    permission_classes = [PuedeGenerarReportes]

    def post(self, request):
        from datetime import datetime
        from django.utils import timezone
        
        serializer = ReporteRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        user = request.user
        estaciones_ids = data.get("estaciones", [])

        # Filtramos según permisos
        if user.tipo == "admin_institucion":
            estaciones = Estacion.objects.filter(
                id__in=estaciones_ids,
                institucion=user.administradorinstitucion.institucion # Esto funciona porque es magia y DJango crea un atributo inverso que permite acceder a la especializacion administradorInstitucion por medio del parametro xd 
            )
        elif user.tipo == "admin_estacion":
            estaciones = Estacion.objects.filter(
                id__in=estaciones_ids,
                id=user.administradorestacion.estacion.id
            )
        elif user.tipo == "tecnico":
            estaciones = Estacion.objects.filter(
                id__in=estaciones_ids,
                id=user.tecnico.estacion.id
            )
        elif user.tipo in ["investigador", "autoridad"]:
            estaciones = Estacion.objects.filter(id__in=estaciones_ids, estado_validacion="aprobada")
        else:
            return Response({"error": "No tiene permisos para reportes detallados"}, status=403)

        if not estaciones.exists():
            return Response({"error": "No tiene permisos sobre las estaciones solicitadas"}, status=403)

        # Parsear fechas
        try:
            fecha_inicio_str = data["fecha_inicio"]
            fecha_fin_str = data["fecha_fin"]
            
            if isinstance(fecha_inicio_str, str):
                fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio_str, "%Y-%m-%d"))
            else:
                fecha_inicio = fecha_inicio_str
                
            if isinstance(fecha_fin_str, str):
                fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin_str, "%Y-%m-%d"))
                fecha_fin = fecha_fin.replace(hour=23, minute=59, second=59)
            else:
                fecha_fin = fecha_fin_str
        except (ValueError, KeyError) as e:
            return Response({
                "error": f"Formato de fecha inválido: {str(e)}"
            }, status=400)

        tipo = data["tipo_reporte"]
        
        try:
            contenido = {
                "calidad_aire": reporte_calidad_aire,
                "tendencias": reporte_tendencias,
                "alertas": reporte_alertas,
                "infraestructura": reporte_infraestructura
            }[tipo](estaciones, fecha_inicio, fecha_fin)
        except Exception as e:
            return Response({
                "error": f"Error al generar reporte: {str(e)}"
            }, status=500)

        return Response({
            "tipo": tipo,
            "estaciones": [e.id for e in estaciones],
            "fecha_inicio": data["fecha_inicio"],
            "fecha_fin": data["fecha_fin"],
            "datos": contenido
        }, status=200)

class ReporteExportarView(APIView):
    permission_classes = [PuedeGenerarReportes]

    def get(self, request):
        from datetime import datetime
        from django.utils import timezone
        estaciones = Estacion.objects.filter(estado_validacion="aprobada")
        tipo = request.query_params.get("tipo_reporte", "calidad_aire")
        fecha_inicio_str = request.query_params.get("fecha_inicio")
        fecha_fin_str = request.query_params.get("fecha_fin")
        formato = request.query_params.get("formato", "json")

        # Parsear fechas
        try:
            if fecha_inicio_str:
                fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio_str, "%Y-%m-%d"))
            else:
                fecha_inicio = timezone.now() - timezone.timedelta(days=30)
            if fecha_fin_str:
                fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin_str, "%Y-%m-%d"))
                fecha_fin = fecha_fin.replace(hour=23, minute=59, second=59)
            else:
                fecha_fin = timezone.now()
        except ValueError as e:
            return Response({"error": f"Formato de fecha inválido. Use YYYY-MM-DD. Detalle: {str(e)}"}, status=400)

        # Ejecutar reporte
        try:
            contenido = {
                "calidad_aire": reporte_calidad_aire,
                "tendencias": reporte_tendencias,
                "alertas": reporte_alertas,
                "infraestructura": reporte_infraestructura
            }[tipo](estaciones, fecha_inicio, fecha_fin)
        except Exception as e:
            return Response({"error": f"Error al generar reporte: {str(e)}"}, status=500)

        # Exportar según formato
        if formato == "json":
            response = HttpResponse(json.dumps(contenido, ensure_ascii=False, indent=2), content_type="application/json")
            response['Content-Disposition'] = f'attachment; filename="reporte_{tipo}_{fecha_inicio_str or ""}_{fecha_fin_str or ""}.json"'
            return response
        elif formato == "csv":
            import csv
            from io import StringIO
            output = StringIO()
            writer = csv.writer(output)
            # Ejemplo simple: solo para calidad_aire
            if tipo == "calidad_aire":
                writer.writerow(["Variable", "Promedio", "Max", "Min", "Num mediciones"])
                for var, data in contenido["resumen"].items():
                    writer.writerow([var, data["promedio"], data["max"], data["min"], data["num_mediciones"]])
            else:
                writer.writerow(["No implementado para este tipo"])
            response = HttpResponse(output.getvalue(), content_type="text/csv")
            response['Content-Disposition'] = f'attachment; filename="reporte_{tipo}_{fecha_inicio_str or ""}_{fecha_fin_str or ""}.csv"'
            return response
        elif formato == "pdf":
            # PDF dummy (puedes reemplazar por generación real con ReportLab, etc.)
            from io import BytesIO
            buffer = BytesIO()
            buffer.write(b"Reporte PDF no implementado.\n")
            buffer.write(json.dumps(contenido, ensure_ascii=False, indent=2).encode("utf-8"))
            response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
            response['Content-Disposition'] = f'attachment; filename="reporte_{tipo}_{fecha_inicio_str or ""}_{fecha_fin_str or ""}.pdf"'
            return response
        else:
            return Response({"error": "Formato no soportado"}, status=400)

