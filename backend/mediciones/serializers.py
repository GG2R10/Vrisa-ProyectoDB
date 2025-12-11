from rest_framework import serializers
from .models import Medicion

class MedicionSerializer(serializers.ModelSerializer):
    # Campos adicionales para compatibilidad con frontend
    fecha = serializers.SerializerMethodField()
    tipo_contaminante = serializers.SerializerMethodField()
    
    class Meta:
        model = Medicion
        fields = ['id', 'sensor', 'tipo', 'valor', 'fecha_hora', 'fecha', 'tipo_contaminante']
    
    def get_fecha(self, obj):
        """Mapea fecha_hora a fecha para el frontend"""
        return obj.fecha_hora
    
    def get_tipo_contaminante(self, obj):
        """Mapea tipo a tipo_contaminante para el frontend"""
        return obj.tipo

    def validate(self, data):
        sensor = data['sensor']
        variable = data['tipo']

        # Asegurarse de que el sensor pueda medir esa variable
        if variable not in sensor.variables_medibles:
            raise serializers.ValidationError(
                f"El sensor '{sensor}' no mide la variable '{variable}'"
            )

        return data

