from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Institucion
from .serializers import InstitucionSerializer


# CRUD básico
class InstitucionListCreateView(generics.ListCreateAPIView):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer


class InstitucionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer


# --- ENDPOINTS ESPECIALES ---
from usuarios.models import AdministradorInstitucion

class AprobarInstitucionView(APIView):

    def post(self, request, pk):
        try:
            institucion = Institucion.objects.get(pk=pk)
        except Institucion.DoesNotExist:
            return Response({"error": "Institución no encontrada"}, status=404)

        institucion.estado_validacion = 'aprobada'
        institucion.save()

        # --- Lógica para asignar administrador de institución ---
        if institucion.creador:
            # Cambiar tipo del usuario
            institucion.creador.tipo = 'admin_institucion'
            institucion.creador.save()

            # Crear registro en AdministradorInstitucion
            AdministradorInstitucion.objects.create(
                usuario=institucion.creador,
                institucion=institucion
            )

        return Response({"mensaje": "Institución aprobada y usuario asignado como administrador"})

class RechazarInstitucionView(APIView):

    def post(self, request, pk):
        try:
            institucion = Institucion.objects.get(pk=pk)
        except Institucion.DoesNotExist:
            return Response({"error": "Institución no encontrada"}, status=404)

        institucion.delete()

        return Response({"mensaje": "Petición de Institución eliminada exitosamente"})
