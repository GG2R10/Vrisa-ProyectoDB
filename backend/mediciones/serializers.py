from rest_framework import serializers
from .models import Medicion

class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = ['id', 'sensor', 'tipo', 'valor', 'fecha_hora']

    def validate(self, data):
        sensor = data['sensor']
        variable = data['tipo']

        # Asegurarse de que el sensor pueda medir esa variable
        if variable not in sensor.variables_medibles:
            raise serializers.ValidationError(
                f"El sensor '{sensor}' no mide la variable '{variable}'"
            )

        return data

