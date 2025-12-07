from rest_framework import serializers
from .models import Institucion

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = [
            'id',
            'nombre',
            'logo',
            'direccion',
            'color_primario',
            'color_secundario',
            'estado_validacion',
            'fecha_creacion'
        ]
        read_only_fields = ['estado_validacion', 'fecha_creacion']
