import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario

# Ver si el usuario existe
try:
    user = Usuario.objects.get(username='testuser')
    print(f'Usuario encontrado: {user.username}')
    print(f'Verificar contraseña: {user.check_password("Test1234")}')
    print(f'Email: {user.email}')
    print(f'Tipo: {user.tipo}')
except Usuario.DoesNotExist:
    print('Usuario no encontrado')
