from rest_framework import serializers
from .models import Alerta

class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerta
        fields = ['id', 'tipo', 'fecha_emision', 'nivel_contaminacion', 'descripcion', 'estacion']
        read_only_fields = ['fecha_emision']