from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Estacion, AdministradorEstacion
from .serializers import EstacionSerializer
from usuarios.models import Usuario, Tecnico, AdministradorInstitucion

class EstacionListCreateView(generics.ListCreateAPIView):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer

    def perform_create(self, serializer):
        # Asignamos el usuario que hace la solicitud como creador
        serializer.save(creador=self.request.user)


class EstacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer


# --- ENDPOINTS ESPECIALES ---
class AprobarEstacionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_estacion):
        estacion = Estacion.objects.get(id=id_estacion)
        user = request.user

        # 1. Validar que el usuario es admin de la institución correcta
        try:
            admin = AdministradorInstitucion.objects.get(usuario=user)
        except AdministradorInstitucion.DoesNotExist:
            return Response({"detail": "No eres administrador de ninguna institución."}, status=403)

        if admin.institucion != estacion.institucion:
            return Response({"detail": "No puedes aprobar estaciones de otra institución."}, status=403)

        # 2. Estado correcto
        if estacion.estado_validacion != "PENDIENTE":
            return Response({"detail": "La estación ya fue procesada."}, status=400)

        # 3. Convertir técnico
        tecnico_user = estacion.tecnico

        if tecnico_user.tipo not in ["ciudadano"]:
            return Response({"detail": "El usuario seleccionado no puede ser técnico."}, status=400)

        tecnico_user.tipo = "tecnico"
        tecnico_user.save()

        Tecnico.objects.create(
            usuario=tecnico_user,
            estacion=estacion
        )

        # 4. Convertir creador en admin de estación
        creador = estacion.creado_por
        creador.tipo = "admin_estacion"
        creador.save()

        AdministradorEstacion.objects.create(
            usuario=creador,
            estacion=estacion
        )

        # 5. Cambiar estado
        estacion.estado_validacion = "APROBADA"
        estacion.save()

        return Response({"detail": "Estación aprobada exitosamente."})



class RechazarEstacionView(APIView):

    def post(self, request, pk):
        try:
            estacion = Estacion.objects.get(pk=pk)
        except Estacion.DoesNotExist:
            return Response({"error": "Estación no encontrada"}, status=404)

        estacion.delete()  # Borramos la estación si es rechazada
        return Response({"mensaje": "Estación rechazada y eliminada"})
