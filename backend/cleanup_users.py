import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario

# Eliminar usuario sin username
users_to_delete = Usuario.objects.filter(username='')
print(f'Eliminando {users_to_delete.count()} usuarios sin username')
for user in users_to_delete:
    print(f'Eliminando: {user.email}')
    user.delete()

print('\nUsuarios restantes:')
for u in Usuario.objects.all():
    print(f'{u.username} ({u.email}) - {u.tipo}')
