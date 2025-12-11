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
    try:
        if hasattr(user, 'admin_institucion'):
            print(f'Institución: {user.admin_institucion.institucion.nombre}')
        else:
            print('Institución: N/A')
    except Exception as e:
        print(f'Error obteniendo institución: {e}')
    print(f'Verificar contraseña: {user.check_password("asustado123")}')
except Usuario.DoesNotExist:
    print('Usuario no encontrado')

# Listar todos los usuarios
print('\n--- Todos los usuarios ---')
for u in Usuario.objects.all():
    print(f'{u.username} ({u.email}) - {u.tipo}')
