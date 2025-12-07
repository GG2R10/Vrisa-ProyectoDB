from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Alerta
from .serializers import AlertaSerializer

# Listar todas las alertas o crear una nueva
class AlertaListCreateView(generics.ListCreateAPIView):
    queryset = Alerta.objects.all().order_by('-fecha_emision')
    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

# Detalle, actualizar o eliminar una alerta
class AlertaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

