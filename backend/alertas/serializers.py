from rest_framework import serializers
from .models import Alerta

class AlertaSerializer(serializers.ModelSerializer):
    # Campos adicionales para compatibilidad con frontend
    tipo_alerta = serializers.SerializerMethodField()
    estacion_nombre = serializers.SerializerMethodField()
    fecha_hora_generacion = serializers.SerializerMethodField()
    valor_medicion = serializers.SerializerMethodField()
    unidad_medida = serializers.SerializerMethodField()
    
    class Meta:
        model = Alerta
        fields = [
            'id', 
            'tipo', 
            'tipo_alerta',  # Alias para frontend
            'fecha_emision', 
            'fecha_hora_generacion',  # Alias para frontend
            'nivel_contaminacion', 
            'valor_medicion',  # Alias para frontend
            'descripcion', 
            'estacion',
            'estacion_nombre',  # Nombre de la estación
            'unidad_medida'
        ]
        read_only_fields = ['fecha_emision']
    
    def get_tipo_alerta(self, obj):
        """Mapea tipo a tipo_alerta para el frontend"""
        return obj.tipo
    
    def get_estacion_nombre(self, obj):
        """Devuelve el nombre de la estación"""
        return obj.estacion.nombre if obj.estacion else None
    
    def get_fecha_hora_generacion(self, obj):
        """Mapea fecha_emision a fecha_hora_generacion para el frontend"""
        return obj.fecha_emision
    
    def get_valor_medicion(self, obj):
        """Mapea nivel_contaminacion a valor_medicion para el frontend"""
        return obj.nivel_contaminacion
    
    def get_unidad_medida(self, obj):
        """Devuelve la unidad de medida basada en el tipo de contaminante"""
        # Por ahora retornamos µg/m³ como default
        return "µg/m³"
