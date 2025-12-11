from rest_framework import serializers
from .models import Usuario, SolicitudInvestigador, SolicitudAutoridad, AdministradorInstitucion, AdministradorEstacion, Tecnico

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'nombre', 'apellido', 'email', 'tipo', 'password', 'solicita_investigador', 'solicita_autoridad', 'es_autoridad_aprobada', 'investigador_aprobado']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Generar username a partir del email (parte antes de @)
        email = validated_data['email']
        username = email.split('@')[0]
        
        user = Usuario(
            email=email,
            username=username,  # Asignar username
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],
            tipo='ciudadano',
            solicita_investigador=validated_data.get('solicita_investigador', False),
            solicita_autoridad=validated_data.get('solicita_autoridad', False),
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Si solicita ser investigador, crear la solicitud
        if user.solicita_investigador:
            SolicitudInvestigador.objects.create(usuario=user)
        
        # Si solicita ser autoridad, crear la solicitud
        if user.solicita_autoridad:
            SolicitudAutoridad.objects.create(usuario=user)
        
        return user

class UsuarioDetailSerializer(serializers.ModelSerializer):
    """Serializer con información adicional del usuario incluyendo su rol específico"""
    admin_institucion = serializers.SerializerMethodField()
    admin_estacion = serializers.SerializerMethodField()
    tecnico = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido', 'email', 'tipo', 'solicita_investigador', 'solicita_autoridad', 'es_autoridad_aprobada', 'investigador_aprobado', 'admin_institucion', 'admin_estacion', 'tecnico']
    
    def get_admin_institucion(self, obj):
        try:
            admin = AdministradorInstitucion.objects.get(usuario=obj)
            return {
                'id': admin.id,
                'institucion_id': admin.institucion.id,
                'institucion_nombre': admin.institucion.nombre,
                'color_primario': admin.institucion.color_primario,
                'color_secundario': admin.institucion.color_secundario
            }
        except AdministradorInstitucion.DoesNotExist:
            return None
    
    def get_admin_estacion(self, obj):
        try:
            admin = AdministradorEstacion.objects.get(usuario=obj)
            return {
                'id': admin.id,
                'estacion_id': admin.estacion.id,
                'estacion_nombre': admin.estacion.nombre,
                'institucion_id': admin.estacion.institucion.id,
                'institucion_nombre': admin.estacion.institucion.nombre,
                'color_primario': admin.estacion.institucion.color_primario,
                'color_secundario': admin.estacion.institucion.color_secundario
            }
        except AdministradorEstacion.DoesNotExist:
            return None
    
    def get_tecnico(self, obj):
        try:
            tecnico = Tecnico.objects.get(usuario=obj)
            return {
                'id': tecnico.id,
                'estacion_id': tecnico.estacion.id,
                'estacion_nombre': tecnico.estacion.nombre,
                'institucion_id': tecnico.estacion.institucion.id,
                'institucion_nombre': tecnico.estacion.institucion.nombre,
                'color_primario': tecnico.estacion.institucion.color_primario,
                'color_secundario': tecnico.estacion.institucion.color_secundario
            }
        except Tecnico.DoesNotExist:
            return None

class SolicitudInvestigadorSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    usuario_apellido = serializers.CharField(source='usuario.apellido', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    resuelto_por_nombre = serializers.CharField(source='resuelto_por.nombre', read_only=True)
    
    class Meta:
        model = SolicitudInvestigador
        fields = ['id', 'usuario', 'usuario_nombre', 'usuario_apellido', 'usuario_email', 'estado', 'fecha_solicitud', 'fecha_resolucion', 'resuelto_por', 'resuelto_por_nombre']
        read_only_fields = ['usuario', 'estado', 'fecha_solicitud', 'fecha_resolucion', 'resuelto_por']

class SolicitudAutoridadSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    usuario_apellido = serializers.CharField(source='usuario.apellido', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    resuelto_por_nombre = serializers.CharField(source='resuelto_por.nombre', read_only=True)
    
    class Meta:
        model = SolicitudAutoridad
        fields = ['id', 'usuario', 'usuario_nombre', 'usuario_apellido', 'usuario_email', 'estado', 'fecha_solicitud', 'fecha_resolucion', 'resuelto_por', 'resuelto_por_nombre']
        read_only_fields = ['usuario', 'estado', 'fecha_solicitud', 'fecha_resolucion', 'resuelto_por']

