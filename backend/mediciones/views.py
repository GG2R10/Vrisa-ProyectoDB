from rest_framework import generics
from .models import Medicion
from .serializers import MedicionSerializer

class MedicionListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicionSerializer

    def get_queryset(self):
        queryset = Medicion.objects.all()
        
        # Filtros
        estacion_id = self.request.query_params.get('estacion')
        tipo = self.request.query_params.get('tipo')
        fecha_inicio = self.request.query_params.get('fecha_hora__gte')
        fecha_fin = self.request.query_params.get('fecha_hora__lte')
        # Soporte para nombre de variable legacy
        tipo_contaminante = self.request.query_params.get('tipo_contaminante')

        if estacion_id:
            # Filtrar por el ID de la estación a través de la relación con Sensor
            queryset = queryset.filter(sensor__estacion_id=estacion_id)
        
        if tipo:
            queryset = queryset.filter(tipo__iexact=tipo)
        elif tipo_contaminante:
             queryset = queryset.filter(tipo__iexact=tipo_contaminante)
            
        if fecha_inicio:
            queryset = queryset.filter(fecha_hora__gte=fecha_inicio)
            
        if fecha_fin:
            queryset = queryset.filter(fecha_hora__lte=fecha_fin)
            
        return queryset.order_by('fecha_hora')
class MedicionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer
