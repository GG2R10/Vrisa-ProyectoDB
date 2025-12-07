from rest_framework import generics
from .models import Medicion
from .serializers import MedicionSerializer

class MedicionListCreateView(generics.ListCreateAPIView):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer

class MedicionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer
