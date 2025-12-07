from rest_framework import serializers

class ReporteRequestSerializer(serializers.Serializer):
    estaciones = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="IDs de estaciones a incluir"
    )

    fecha_inicio = serializers.DateTimeField(required=True)
    fecha_fin = serializers.DateTimeField(required=True)

    tipo_reporte = serializers.ChoiceField(
        choices=[
            ('calidad_aire', 'Calidad del Aire'),
            ('tendencias', 'Tendencias'),
            ('alertas', 'Alertas Críticas'),
            ('infraestructura', 'Infraestructura y Mantenimiento'),
        ]
    )

class ReporteBaseSerializer(serializers.Serializer):
    tipo = serializers.CharField()
    estaciones = serializers.ListField()
    fecha_inicio = serializers.DateTimeField()
    fecha_fin = serializers.DateTimeField()
    datos = serializers.JSONField()