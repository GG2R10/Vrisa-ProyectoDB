from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ReporteRequestSerializer
from .permissions import PuedeGenerarReportes
from estaciones.models import Estacion
from .utils import reporte_calidad_aire, reporte_tendencias, reporte_alertas, reporte_infraestructura

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
        estaciones = Estacion.objects.filter(estado_validacion="aprobada")
        tipo = request.query_params.get("tipo_reporte", "calidad_aire")
        fecha_inicio = request.query_params.get("fecha_inicio")
        fecha_fin = request.query_params.get("fecha_fin")

        # Ejecutamos el reporte correspondiente
        contenido = {
            "calidad_aire": reporte_calidad_aire,
            "tendencias": reporte_tendencias,
            "alertas": reporte_alertas,
            "infraestructura": reporte_infraestructura
        }[tipo](estaciones, fecha_inicio, fecha_fin)

        return Response({
            "tipo": tipo,
            "estaciones": [e.id for e in estaciones],
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "datos": contenido
        }, status=200)

class ReporteDetalladoView(APIView):
    permission_classes = [PuedeGenerarReportes]

    def post(self, request):
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

        tipo = data["tipo_reporte"]
        contenido = {
            "calidad_aire": reporte_calidad_aire,
            "tendencias": reporte_tendencias,
            "alertas": reporte_alertas,
            "infraestructura": reporte_infraestructura
        }[tipo](estaciones, data["fecha_inicio"], data["fecha_fin"])

        return Response({
            "tipo": tipo,
            "estaciones": [e.id for e in estaciones],
            "fecha_inicio": data["fecha_inicio"],
            "fecha_fin": data["fecha_fin"],
            "datos": contenido
        }, status=200)
