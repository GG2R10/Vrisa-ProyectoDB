from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Estacion
from .serializers import EstacionSerializer
from usuarios.models import Usuario, Tecnico, AdministradorInstitucion, AdministradorEstacion


class IsAdminSistema(BasePermission):
    """Permiso para usuarios que sean admin del sistema"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'admin_sistema'


class IsAdminInstitucion(BasePermission):
    """Permiso para usuarios que sean admin de institución"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'admin_institucion'


class EstacionListCreateView(generics.ListCreateAPIView):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer

    def perform_create(self, serializer):
        # Asignamos el usuario que hace la solicitud como creador
        serializer.save(creador=self.request.user)


class EstacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer


class ListarEstacionesPendientesView(generics.ListAPIView):
    """Listar estaciones pendientes de aprobación (para admin de institución)"""
    serializer_class = EstacionSerializer
    permission_classes = [IsAdminInstitucion]
    
    def get_queryset(self):
        try:
            admin = AdministradorInstitucion.objects.get(usuario=self.request.user)
            return Estacion.objects.filter(
                institucion=admin.institucion,
                estado_validacion='pendiente'
            )
        except AdministradorInstitucion.DoesNotExist:
            return Estacion.objects.none()


class ListarEstacionesSistemaView(generics.ListAPIView):
    """Listar todas las estaciones (para admin del sistema)"""
    serializer_class = EstacionSerializer
    permission_classes = [IsAdminSistema]
    queryset = Estacion.objects.all()


# --- ENDPOINTS ESPECIALES ---
class AprobarEstacionView(APIView):
    permission_classes = [IsAdminInstitucion]

    def post(self, request, pk):
        try:
            estacion = Estacion.objects.get(pk=pk)
        except Estacion.DoesNotExist:
            return Response(
                {"error": "Estación no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        # 1. Validar que el usuario es admin de la institución correcta
        try:
            admin = AdministradorInstitucion.objects.get(usuario=user)
        except AdministradorInstitucion.DoesNotExist:
            return Response(
                {"detail": "No eres administrador de ninguna institución."},
                status=status.HTTP_403_FORBIDDEN
            )

        if admin.institucion != estacion.institucion:
            return Response(
                {"detail": "No puedes aprobar estaciones de otra institución."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Estado correcto
        if estacion.estado_validacion != "pendiente":
            return Response(
                {"detail": "La estación ya fue procesada."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Convertir técnico
        tecnico_user = estacion.tecnico

        if tecnico_user is None:
            return Response(
                {"detail": "No se especificó un técnico para la estación."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if tecnico_user.tipo != "ciudadano":
            return Response(
                {"detail": "El usuario seleccionado no puede ser técnico (ya tiene otro rol)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        tecnico_user.tipo = "tecnico"
        tecnico_user.save()

        Tecnico.objects.create(
            usuario=tecnico_user,
            estacion=estacion
        )

        # 4. Convertir creador en admin de estación
        creador = estacion.creador
        if creador.tipo != "ciudadano":
            return Response(
                {"detail": "El creador de la solicitud no puede ser admin de estación (ya tiene otro rol)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        creador.tipo = "admin_estacion"
        creador.save()

        AdministradorEstacion.objects.create(
            usuario=creador,
            estacion=estacion
        )

        # 5. Cambiar estado
        estacion.estado_validacion = "aprobada"
        estacion.save()

        serializer = EstacionSerializer(estacion)
        return Response({"detail": "Estación aprobada exitosamente.", "estacion": serializer.data})


class RechazarEstacionView(APIView):
    permission_classes = [IsAdminInstitucion]

    def post(self, request, pk):
        try:
            estacion = Estacion.objects.get(pk=pk)
        except Estacion.DoesNotExist:
            return Response(
                {"error": "Estación no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validar que el usuario es admin de la institución
        try:
            admin = AdministradorInstitucion.objects.get(usuario=request.user)
        except AdministradorInstitucion.DoesNotExist:
            return Response(
                {"detail": "No eres administrador de ninguna institución."},
                status=status.HTTP_403_FORBIDDEN
            )

        if admin.institucion != estacion.institucion:
            return Response(
                {"detail": "No puedes rechazar estaciones de otra institución."},
                status=status.HTTP_403_FORBIDDEN
            )

        if estacion.estado_validacion != "pendiente":
            return Response(
                {"detail": "La estación ya fue procesada."},
                status=status.HTTP_400_BAD_REQUEST
            )

        estacion.delete()
        return Response({"mensaje": "Estación rechazada y eliminada"})


class EliminarEstacionView(APIView):
    """Eliminar una estación (solo admin del sistema)"""
    permission_classes = [IsAdminSistema]

    def post(self, request, pk):
        try:
            estacion = Estacion.objects.get(pk=pk)
        except Estacion.DoesNotExist:
            return Response(
                {"error": "Estación no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        estacion.delete()
        return Response({"mensaje": "Estación eliminada"})


class ModificarEstacionView(APIView):
    """Modificar una estación (admin del sistema o admin de la institución)"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            estacion = Estacion.objects.get(pk=pk)
        except Estacion.DoesNotExist:
            return Response(
                {"error": "Estación no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validar permisos
        if request.user.tipo == 'admin_sistema':
            # Admin sistema puede modificar cualquier estación
            pass
        elif request.user.tipo == 'admin_institucion':
            try:
                admin = AdministradorInstitucion.objects.get(usuario=request.user)
                if admin.institucion != estacion.institucion:
                    return Response(
                        {"detail": "No puedes modificar estaciones de otra institución."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except AdministradorInstitucion.DoesNotExist:
                return Response(
                    {"detail": "No eres administrador de ninguna institución."},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {"detail": "No tienes permisos para modificar estaciones."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = EstacionSerializer(estacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

