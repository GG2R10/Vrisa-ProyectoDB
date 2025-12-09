"""
Script para crear usuarios de prueba en la base de datos
Ejecutar desde el directorio backend con: python crear_usuarios_prueba.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario, AdministradorSistema, AdministradorInstitucion, AdministradorEstacion, SolicitudInvestigador, SolicitudAutoridad
from instituciones.models import Institucion
from estaciones.models import Estacion

# Crear Administrador del Sistema
try:
    admin_sistema = Usuario.objects.create_user(
        username='admin',
        email='admin@vrisa.com',
        password='admin123',
        nombre='Admin',
        apellido='Sistema',
        tipo='admin_sistema'
    )
    admin_sistema.is_staff = True
    admin_sistema.is_superuser = True
    admin_sistema.save()
    
    AdministradorSistema.objects.create(
        usuario=admin_sistema,
        super_admin=True
    )
    print("✓ Usuario Admin Sistema creado: admin@vrisa.com / admin123")
except Exception as e:
    print(f"× Error al crear admin sistema: {e}")

# Crear Institución de prueba
try:
    institucion = Institucion.objects.create(
        nombre='DAGMA - Departamento Administrativo de Gestión del Medio Ambiente',
        tipo_institucion='publica',
        email_contacto='contacto@dagma.gov.co',
        telefono='3185551234',
        direccion='Calle 5 # 36-08, Cali',
        descripcion='Autoridad ambiental de Cali',
        estado_validacion='aprobada',
        color_primario='#0d6efd',
        color_secundario='#6c757d'
    )
    print(f"✓ Institución creada: {institucion.nombre}")
except Exception as e:
    print(f"× Error al crear institución: {e}")
    # Si ya existe, obtenerla
    institucion = Institucion.objects.first()

# Crear Administrador de Institución
try:
    admin_inst = Usuario.objects.create_user(
        username='admin_dagma',
        email='admin@dagma.gov.co',
        password='dagma123',
        nombre='Carlos',
        apellido='Rodríguez',
        tipo='admin_institucion'
    )
    
    AdministradorInstitucion.objects.create(
        usuario=admin_inst,
        institucion=institucion
    )
    print("✓ Usuario Admin Institución creado: admin@dagma.gov.co / dagma123")
except Exception as e:
    print(f"× Error al crear admin institución: {e}")

# Crear Estación de prueba
try:
    estacion = Estacion.objects.create(
        nombre='Estación Univalle Norte',
        descripcion='Estación de monitoreo en la Universidad del Valle',
        latitud=3.376110,
        longitud=-76.532010,
        direccion='Universidad del Valle, Calle 13 # 100-00',
        institucion=institucion,
        estado='activa',
        estado_validacion='aprobada'
    )
    print(f"✓ Estación creada: {estacion.nombre}")
except Exception as e:
    print(f"× Error al crear estación: {e}")
    # Si ya existe, obtenerla
    estacion = Estacion.objects.first()

# Crear Administrador de Estación
try:
    admin_est = Usuario.objects.create_user(
        username='admin_univalle',
        email='admin@univalle.edu.co',
        password='univalle123',
        nombre='María',
        apellido='González',
        tipo='admin_estacion'
    )
    
    if estacion:
        AdministradorEstacion.objects.create(
            usuario=admin_est,
            estacion=estacion
        )
    print("✓ Usuario Admin Estación creado: admin@univalle.edu.co / univalle123")
except Exception as e:
    print(f"× Error al crear admin estación: {e}")

# Crear Ciudadano
try:
    ciudadano = Usuario.objects.create_user(
        username='ciudadano1',
        email='ciudadano@example.com',
        password='ciudadano123',
        nombre='Juan',
        apellido='Pérez',
        tipo='ciudadano'
    )
    print("✓ Usuario Ciudadano creado: ciudadano@example.com / ciudadano123")
except Exception as e:
    print(f"× Error al crear ciudadano: {e}")

# Crear Investigador
try:
    investigador = Usuario.objects.create_user(
        username='investigador1',
        email='investigador@univalle.edu.co',
        password='invest123',
        nombre='Laura',
        apellido='Martínez',
        tipo='investigador'
    )
    print("✓ Usuario Investigador creado: investigador@univalle.edu.co / invest123")
except Exception as e:
    print(f"× Error al crear investigador: {e}")

print("\n" + "="*60)
print("CREDENCIALES DE ACCESO CREADAS:")
print("="*60)
print("\n1. ADMINISTRADOR DEL SISTEMA")
print("   Email: admin@vrisa.com")
print("   Password: admin123")
print("   Rol: Gestión completa del sistema, aprobación de instituciones")

print("\n2. ADMINISTRADOR DE INSTITUCIÓN (DAGMA)")
print("   Email: admin@dagma.gov.co")
print("   Password: dagma123")
print("   Rol: Gestión de estaciones de la institución")

print("\n3. ADMINISTRADOR DE ESTACIÓN (Univalle)")
print("   Email: admin@univalle.edu.co")
print("   Password: univalle123")
print("   Rol: Gestión de sensores y mediciones de la estación")

print("\n4. CIUDADANO")
print("   Email: ciudadano@example.com")
print("   Password: ciudadano123")
print("   Rol: Consulta pública de datos")

print("\n5. INVESTIGADOR")
print("   Email: investigador@univalle.edu.co")
print("   Password: invest123")
print("   Rol: Acceso a reportes y análisis avanzados")

print("\n" + "="*60)
