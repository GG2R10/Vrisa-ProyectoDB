import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.views import CustomTokenObtainPairSerializer

# Probar el serializador
serializer = CustomTokenObtainPairSerializer(data={'username': 'testuser', 'password': 'Test1234'})
print(f'Es válido: {serializer.is_valid()}')
print(f'Errores: {serializer.errors}')
if serializer.is_valid():
    print(f'Datos: {serializer.validated_data}')
