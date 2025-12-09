import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario

# Ver si el usuario existe
try:
    user = Usuario.objects.get(username='asus_tado')
    print(f'Usuario encontrado: {user.username}')
    print(f'Email: {user.email}')
    print(f'Nombre: {user.nombre}')
    print(f'Apellido: {user.apellido}')
    print(f'Tipo: {user.tipo}')
    print(f'Institución: {user.institucion}')
    print(f'Verificar contraseña: {user.check_password("asustado123")}')
except Usuario.DoesNotExist:
    print('Usuario no encontrado')

# Listar todos los usuarios
print('\n--- Todos los usuarios ---')
for u in Usuario.objects.all():
    print(f'{u.username} ({u.email}) - {u.tipo}')
