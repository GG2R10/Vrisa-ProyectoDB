from rest_framework import viewsets, generics, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, SolicitudInvestigador, SolicitudAutoridad
from .serializers import UsuarioSerializer, UsuarioDetailSerializer, SolicitudInvestigadorSerializer, SolicitudAutoridadSerializer


class IsAdminSistema(BasePermission):
    """Permiso para usuarios que sean admin del sistema"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'admin_sistema'


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        """
        Permitir creación (POST) sin autenticación.
        Otras acciones requieren autenticación.
        """
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]


class CurrentUserDetailView(APIView):
    """Obtiene detalles del usuario actualmente autenticado"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UsuarioDetailSerializer(request.user)
        return Response(serializer.data)


class SolicitudInvestigadorCreateView(APIView):
    """Crear o actualizar solicitud de investigador"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        usuario = request.user
        
        # Solo ciudadanos pueden solicitar
        if usuario.tipo != 'ciudadano':
            return Response(
                {"error": "Solo ciudadanos pueden solicitar ser investigadores"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si ya tiene solicitud pendiente
        try:
            solicitud = SolicitudInvestigador.objects.get(usuario=usuario)
            if solicitud.estado == 'pendiente':
                return Response(
                    {"error": "Ya tienes una solicitud pendiente"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif solicitud.estado == 'aprobada':
                return Response(
                    {"error": "Ya eres investigador"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except SolicitudInvestigador.DoesNotExist:
            pass
        
        # Crear solicitud
        solicitud = SolicitudInvestigador.objects.create(usuario=usuario)
        usuario.solicita_investigador = True
        usuario.save()
        
        serializer = SolicitudInvestigadorSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SolicitudAutoridadCreateView(APIView):
    """Crear o actualizar solicitud de autoridad ambiental"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        usuario = request.user
        
        # Solo ciudadanos pueden solicitar
        if usuario.tipo != 'ciudadano':
            return Response(
                {"error": "Solo ciudadanos pueden solicitar ser autoridad ambiental"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si ya tiene solicitud pendiente
        try:
            solicitud = SolicitudAutoridad.objects.get(usuario=usuario)
            if solicitud.estado == 'pendiente':
                return Response(
                    {"error": "Ya tienes una solicitud pendiente"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif solicitud.estado == 'aprobada':
                return Response(
                    {"error": "Ya eres autoridad ambiental"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except SolicitudAutoridad.DoesNotExist:
            pass
        
        # Crear solicitud
        solicitud = SolicitudAutoridad.objects.create(usuario=usuario)
        usuario.solicita_autoridad = True
        usuario.save()
        
        serializer = SolicitudAutoridadSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListarSolicitudesInvestigadorView(generics.ListAPIView):
    """Listar todas las solicitudes de investigador (solo admin sistema)"""
    serializer_class = SolicitudInvestigadorSerializer
    permission_classes = [IsAdminSistema]
    
    def get_queryset(self):
        estado = self.request.query_params.get('estado', 'pendiente')
        return SolicitudInvestigador.objects.filter(estado=estado).order_by('-fecha_solicitud')


class ListarSolicitudesAutoridadView(generics.ListAPIView):
    """Listar todas las solicitudes de autoridad (solo admin sistema)"""
    serializer_class = SolicitudAutoridadSerializer
    permission_classes = [IsAdminSistema]
    
    def get_queryset(self):
        estado = self.request.query_params.get('estado', 'pendiente')
        return SolicitudAutoridad.objects.filter(estado=estado).order_by('-fecha_solicitud')


class AprobarSolicitudInvestigadorView(APIView):
    """Aprobar solicitud de investigador (solo admin sistema)"""
    permission_classes = [IsAdminSistema]
    
    def post(self, request, pk):
        try:
            solicitud = SolicitudInvestigador.objects.get(pk=pk)
        except SolicitudInvestigador.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if solicitud.estado != 'pendiente':
            return Response(
                {"error": f"La solicitud ya fue {solicitud.estado}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar solicitud
        solicitud.estado = 'aprobada'
        solicitud.fecha_resolucion = timezone.now()
        solicitud.resuelto_por = request.user
        solicitud.save()
        
        # Actualizar usuario
        usuario = solicitud.usuario
        usuario.tipo = 'investigador'
        usuario.investigador_aprobado = True
        usuario.save()
        
        serializer = SolicitudInvestigadorSerializer(solicitud)
        return Response(serializer.data)


class RechazarSolicitudInvestigadorView(APIView):
    """Rechazar solicitud de investigador (solo admin sistema)"""
    permission_classes = [IsAdminSistema]
    
    def post(self, request, pk):
        try:
            solicitud = SolicitudInvestigador.objects.get(pk=pk)
        except SolicitudInvestigador.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if solicitud.estado != 'pendiente':
            return Response(
                {"error": f"La solicitud ya fue {solicitud.estado}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar solicitud
        solicitud.estado = 'rechazada'
        solicitud.fecha_resolucion = timezone.now()
        solicitud.resuelto_por = request.user
        solicitud.save()
        
        # Actualizar usuario
        usuario = solicitud.usuario
        usuario.solicita_investigador = False
        usuario.save()
        
        serializer = SolicitudInvestigadorSerializer(solicitud)
        return Response(serializer.data)


class AprobarSolicitudAutoridadView(APIView):
    """Aprobar solicitud de autoridad ambiental (solo admin sistema)"""
    permission_classes = [IsAdminSistema]
    
    def post(self, request, pk):
        try:
            solicitud = SolicitudAutoridad.objects.get(pk=pk)
        except SolicitudAutoridad.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if solicitud.estado != 'pendiente':
            return Response(
                {"error": f"La solicitud ya fue {solicitud.estado}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar solicitud
        solicitud.estado = 'aprobada'
        solicitud.fecha_resolucion = timezone.now()
        solicitud.resuelto_por = request.user
        solicitud.save()
        
        # Actualizar usuario
        usuario = solicitud.usuario
        usuario.tipo = 'autoridad'
        usuario.es_autoridad_aprobada = True
        usuario.save()
        
        serializer = SolicitudAutoridadSerializer(solicitud)
        return Response(serializer.data)


class RechazarSolicitudAutoridadView(APIView):
    """Rechazar solicitud de autoridad ambiental (solo admin sistema)"""
    permission_classes = [IsAdminSistema]
    
    def post(self, request, pk):
        try:
            solicitud = SolicitudAutoridad.objects.get(pk=pk)
        except SolicitudAutoridad.DoesNotExist:
            return Response(
                {"error": "Solicitud no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if solicitud.estado != 'pendiente':
            return Response(
                {"error": f"La solicitud ya fue {solicitud.estado}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar solicitud
        solicitud.estado = 'rechazada'
        solicitud.fecha_resolucion = timezone.now()
        solicitud.resuelto_por = request.user
        solicitud.save()
        
        # Actualizar usuario
        usuario = solicitud.usuario
        usuario.solicita_autoridad = False
        usuario.save()
        
        serializer = SolicitudAutoridadSerializer(solicitud)
        return Response(serializer.data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializador personalizado para incluir datos del usuario en el token"""
    
    username = serializers.CharField()
    password = serializers.CharField()
    username_field = 'username'
    
    def validate(self, attrs):
        # Obtener credenciales
        username_or_email = attrs.get('username')
        password = attrs.get('password')
        
        if not username_or_email or not password:
            raise serializers.ValidationError("El correo/usuario y contraseña son requeridos")
        
        # Intentar obtener usuario por username o email
        user = None
        try:
            # Primero intentar por username
            user = Usuario.objects.get(username=username_or_email)
        except Usuario.DoesNotExist:
            try:
                # Si no existe, intentar por email
                user = Usuario.objects.get(email=username_or_email)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError("Usuario o contraseña inválidos")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Usuario o contraseña inválidos")
        
        # Obtener tokens usando RefreshToken directamente
        refresh = RefreshToken.for_user(user)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        
        # Agregar información del usuario
        user_data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'nombre': user.nombre,
            'apellido': user.apellido,
            'tipo': user.tipo,
        }
        
        data['user'] = user_data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para obtener token con datos del usuario"""
    serializer_class = CustomTokenObtainPairSerializer


class ListarCiudadanosView(generics.ListAPIView):
    """Listar usuarios ciudadanos sin roles especiales para selección de técnico"""
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]  # Permitir acceso público para registro de estaciones
    
    def get_queryset(self):
        # Retornar solo usuarios de tipo ciudadano
        return Usuario.objects.filter(tipo='ciudadano')
