import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario

# Crear usuario de prueba con username y email simples
try:
    usuario = Usuario.objects.create_user(
        username='testuser',
        email='testuser@test.com',
        password='Test1234',
        nombre='Test',
        apellido='User',
        tipo='ciudadano'
    )
    print(f"✓ Usuario creado exitosamente")
    print(f"  Username: {usuario.username}")
    print(f"  Email: {usuario.email}")
    print(f"  Contraseña: Test1234")
    print(f"  Tipo: {usuario.tipo}")
except Exception as e:
    print(f"✗ Error: {e}")
