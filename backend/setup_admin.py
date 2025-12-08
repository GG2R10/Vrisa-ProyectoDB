import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario

u = Usuario.objects.get(username='admin')
u.set_password('admin123')
u.tipo = 'admin_sistema'
u.save()
print('✓ Contraseña establecida para admin')
print('✓ Usuario configurado como admin_sistema')
print(f'  Email: {u.email}')
print(f'  Tipo: {u.tipo}')
