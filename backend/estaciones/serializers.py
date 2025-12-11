from rest_framework import serializers
from .models import Estacion
from usuarios.models import Tecnico

class EstacionSerializer(serializers.ModelSerializer):
    # Campos adicionales para compatibilidad con frontend
    latitud = serializers.SerializerMethodField()
    longitud = serializers.SerializerMethodField()
    
    class Meta:
        model = Estacion
        fields = [
            'id',
            'nombre',
            'direccion',
            'ubicacion_latitud',
            'ubicacion_longitud',
            'latitud',  # Alias para ubicacion_latitud
            'longitud',  # Alias para ubicacion_longitud
            'ubicacion_referencia',
            'institucion',
            'creador',
            'tecnico',
            'documento_certificado',
            'estado_validacion',
            'fecha_creacion'
        ]
        read_only_fields = ['estado_validacion', 'fecha_creacion', 'creador']
    
    def get_latitud(self, obj):
        """Mapea ubicacion_latitud a latitud para el frontend"""
        return obj.ubicacion_latitud
    
    def get_longitud(self, obj):
        """Mapea ubicacion_longitud a longitud para el frontend"""
        return obj.ubicacion_longitud

    # Validamos que el tecnico no tenga ningun otro rol especial (En teoria es un extra de seguridad, ya que el front siempre deberia limitar las opciones de seleccion)
    def validate_tecnico(self, value):
        # Verificar que el usuario tenga tipo permitido
        if value.tipo not in ['ciudadano', 'investigador']:
            raise serializers.ValidationError("El usuario seleccionado no puede ser técnico debido a su tipo de rol.")

        # Verificar que no sea ya técnico en otra estación
        if Tecnico.objects.filter(usuario=value).exists():
            raise serializers.ValidationError("El usuario seleccionado ya es técnico de otra estación.")

        # Verificar que no sea admin de sistema o de institución
        if value.tipo in ['admin_sistema', 'admin_institucion']:
            raise serializers.ValidationError("El usuario seleccionado no puede ser técnico porque tiene un rol de administrador.")

        return value
