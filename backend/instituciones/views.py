from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Institucion
from .serializers import InstitucionSerializer
from usuarios.models import AdministradorInstitucion


class IsAdminSistema(BasePermission):
    """Permiso para usuarios que sean admin del sistema"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'admin_sistema'


# CRUD básico
class InstitucionListCreateView(generics.ListCreateAPIView):
    serializer_class = InstitucionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.tipo == 'admin_institucion':
            try:
                admin = AdministradorInstitucion.objects.get(usuario=user)
                return Institucion.objects.filter(id=admin.institucion.id)
            except AdministradorInstitucion.DoesNotExist:
                return Institucion.objects.none()
        # Los demás ven todas las instituciones aprobadas
        return Institucion.objects.filter(estado_validacion='aprobada')

    def perform_create(self, serializer):
        # El usuario que crea la institución es el creador
        serializer.save(creador=self.request.user)


class InstitucionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer


class ListarInstitucionesPendientesView(generics.ListAPIView):
    """Listar instituciones pendientes de aprobación (solo admin sistema)"""
    serializer_class = InstitucionSerializer
    permission_classes = [IsAdminSistema]
    
    def get_queryset(self):
        return Institucion.objects.filter(estado_validacion='pendiente')


# --- ENDPOINTS ESPECIALES ---
class AprobarInstitucionView(APIView):
    permission_classes = [IsAdminSistema]

    def post(self, request, pk):
        try:
            institucion = Institucion.objects.get(pk=pk)
        except Institucion.DoesNotExist:
            return Response(
                {"error": "Institución no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        if institucion.estado_validacion != 'pendiente':
            return Response(
                {"error": f"La institución ya fue {institucion.estado_validacion}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        institucion.estado_validacion = 'aprobada'
        institucion.save()

        # --- Lógica para asignar administrador de institución ---
        if institucion.creador:
            # Validar que el usuario sea ciudadano
            if institucion.creador.tipo != 'ciudadano':
                return Response(
                    {"error": "El creador ya tiene otro rol asignado"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Cambiar tipo del usuario
            institucion.creador.tipo = 'admin_institucion'
            institucion.creador.save()

            # Crear registro en AdministradorInstitucion
            AdministradorInstitucion.objects.create(
                usuario=institucion.creador,
                institucion=institucion
            )

        serializer = InstitucionSerializer(institucion)
        return Response({
            "mensaje": "Institución aprobada y usuario asignado como administrador",
            "institucion": serializer.data
        })


class RechazarInstitucionView(APIView):
    permission_classes = [IsAdminSistema]

    def post(self, request, pk):
        try:
            institucion = Institucion.objects.get(pk=pk)
        except Institucion.DoesNotExist:
            return Response(
                {"error": "Institución no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        if institucion.estado_validacion != 'pendiente':
            return Response(
                {"error": f"La institución ya fue {institucion.estado_validacion}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        institucion.delete()
        return Response({"mensaje": "Solicitud de institución eliminada exitosamente"})

