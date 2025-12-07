from rest_framework import generics
from .models import Sensor
from .serializers import SensorSerializer

# Listar y crear sensores
class SensorListCreateView(generics.ListCreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

# Detalle, actualizar y eliminar
class SensorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
