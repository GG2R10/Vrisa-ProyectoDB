"""
Script para crear datos de prueba (seeds) en la base de datos
Crea instituciones, estaciones y usuarios de prueba
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from usuarios.models import Usuario
from instituciones.models import Institucion
from estaciones.models import Estacion
from sensores.models import Sensor
from mediciones.models import Medicion
from django.utils import timezone
from datetime import datetime, timedelta
import random

def crear_instituciones():
    """Crear instituciones de prueba"""
    print("Creando instituciones...")
    
    instituciones_data = [
        {
            'nombre': 'Universidad del Valle',
            'direccion': 'Cali, Valle del Cauca',
            'color_primario': '#1E40AF',
            'color_secundario': '#3B82F6',
        },
        {
            'nombre': 'DAGMA - Departamento Administrativo de Gestión del Medio Ambiente',
            'direccion': 'Cali, Valle del Cauca',
            'color_primario': '#16A34A',
            'color_secundario': '#22C55E',
        },
        {
            'nombre': 'Corporación Autónoma Regional del Cauca',
            'direccion': 'Popayán, Cauca',
            'color_primario': '#7C3AED',
            'color_secundario': '#A78BFA',
        },
    ]
    
    instituciones = []
    for data in instituciones_data:
        inst, created = Institucion.objects.get_or_create(
            nombre=data['nombre'],
            defaults={
                'direccion': data['direccion'],
                'color_primario': data['color_primario'],
                'color_secundario': data['color_secundario'],
                'estado_validacion': 'aprobada',
            }
        )
        if created:
            print(f"  ✓ Creada institución: {inst.nombre}")
        else:
            print(f"  ✓ Institución existente: {inst.nombre}")
        instituciones.append(inst)
    
    return instituciones

def crear_estaciones(instituciones):
    """Crear estaciones de prueba"""
    print("\nCreando estaciones...")
    
    estaciones_data = [
        {
            'nombre': 'Estación Río Cauca - Centro',
            'direccion': 'Centro de Cali',
            'institucion': instituciones[0],
            'lat': 3.3731,
            'lon': -76.5120,
        },
        {
            'nombre': 'Estación Río Cauca - Sur',
            'direccion': 'Sur de Cali',
            'institucion': instituciones[0],
            'lat': 3.3500,
            'lon': -76.5300,
        },
        {
            'nombre': 'Estación DAGMA - Parque',
            'direccion': 'Parque del Pueblo, Cali',
            'institucion': instituciones[1],
            'lat': 3.4500,
            'lon': -76.5000,
        },
        {
            'nombre': 'Estación CRC - Montaña',
            'direccion': 'Zona montañosa, Cauca',
            'institucion': instituciones[2],
            'lat': 3.2500,
            'lon': -76.6000,
        },
    ]
    
    estaciones = []
    for data in estaciones_data:
        est, created = Estacion.objects.get_or_create(
            nombre=data['nombre'],
            defaults={
                'direccion': data['direccion'],
                'institucion': data['institucion'],
                'ubicacion_latitud': data['lat'],
                'ubicacion_longitud': data['lon'],
                'ubicacion_referencia': data['direccion'],
                'estado_validacion': 'aprobada',
            }
        )
        if created:
            print(f"✓ Creada estación: {est.nombre}")
        else:
            print(f"✓ Estación existente: {est.nombre}")
        estaciones.append(est)
    
    return estaciones

def crear_sensores(estaciones):
    """Crear sensores de prueba"""
    print("\nCreando sensores...")
    
    tipos_sensor = ['temperatura', 'humedad', 'pH', 'conductividad', 'oxígeno disuelto', 'turbidez']
    
    sensores = []
    for i, estacion in enumerate(estaciones):
        for j, tipo in enumerate(tipos_sensor[:3]):  # 3 sensores por estación
            nombre_sensor = f'Sensor de {tipo} - {estacion.nombre}'
            sensor, created = Sensor.objects.get_or_create(
                nombre=nombre_sensor,
                estacion=estacion,
                defaults={
                    'tipo': tipo,
                    'unidad_medida': 'C' if tipo == 'temperatura' else '%' if tipo == 'humedad' else 'unidad',
                }
            )
            if created:
                print(f"✓ Creado sensor: {sensor.nombre}")
            sensores.append(sensor)
    
    return sensores

def crear_usuarios_prueba():
    """Crear usuarios de prueba adicionales"""
    print("\nCreando usuarios de prueba...")
    
    usuarios_data = [
        {
            'email': 'ciudadano2@example.com',
            'nombre': 'Juan',
            'apellido': 'Pérez',
            'tipo': 'ciudadano',
        },
        {
            'email': 'ciudadano3@example.com',
            'nombre': 'María',
            'apellido': 'García',
            'tipo': 'ciudadano',
        },
        {
            'email': 'investigador2@univalle.edu.co',
            'nombre': 'Carlos',
            'apellido': 'López',
            'tipo': 'investigador',
        },
        {
            'email': 'investigador3@univalle.edu.co',
            'nombre': 'Ana',
            'apellido': 'Martínez',
            'tipo': 'investigador',
        },
        {
            'email': 'tecnico1@example.com',
            'nombre': 'Roberto',
            'apellido': 'Sánchez',
            'tipo': 'tecnico',
        },
        {
            'email': 'autoridad1@dagma.gov.co',
            'nombre': 'Sandra',
            'apellido': 'Rodríguez',
            'tipo': 'autoridad',
        },
    ]
    
    usuarios = []
    for data in usuarios_data:
        username = data['email'].split('@')[0]
        password = 'Test1234'
        
        user, created = Usuario.objects.get_or_create(
            email=data['email'],
            defaults={
                'username': username,
                'nombre': data['nombre'],
                'apellido': data['apellido'],
                'tipo': data['tipo'],
            }
        )
        
        if created:
            user.set_password(password)
            user.save()
            print(f"✓ Creado usuario: {user.email} (contraseña: {password})")
        else:
            print(f"✓ Usuario existente: {user.email}")
        
        usuarios.append(user)
    
    return usuarios

def crear_mediciones_dummy(sensores):
    """Crear mediciones de prueba"""
    print("\nCreando mediciones dummy...")
    
    ahora = timezone.now()
    count = 0
    
    for sensor in sensores[:6]:  # Solo para los primeros 6 sensores
        # Crear 10 mediciones por sensor en los últimos 7 días
        for i in range(10):
            fecha = ahora - timedelta(days=random.randint(0, 7), hours=random.randint(0, 23))
            
            # Valores realistas según el tipo de sensor
            if 'temperatura' in sensor.tipo.lower():
                valor = round(random.uniform(15, 30), 2)
            elif 'humedad' in sensor.tipo.lower():
                valor = round(random.uniform(40, 95), 2)
            elif 'pH' in sensor.tipo.lower():
                valor = round(random.uniform(6, 8), 2)
            else:
                valor = round(random.uniform(0, 100), 2)
            
            medicion, created = Medicion.objects.get_or_create(
                sensor=sensor,
                fecha=fecha,
                defaults={'valor': valor}
            )
            
            if created:
                count += 1
    
    print(f"✓ Creadas {count} mediciones")

def main():
    print("=" * 50)
    print("GENERADOR DE DATOS DE PRUEBA (SEEDS)")
    print("=" * 50)
    
    instituciones = crear_instituciones()
    estaciones = crear_estaciones(instituciones)
    # sensores = crear_sensores(estaciones)
    usuarios = crear_usuarios_prueba()
    # crear_mediciones_dummy(sensores)
    
    print("\n" + "=" * 50)
    print("✓ DATOS DE PRUEBA CREADOS EXITOSAMENTE")
    print("=" * 50)
    print("\nInstituciones creadas:")
    for inst in instituciones:
        print(f"  - {inst.nombre}")
    
    print("\nEstaciones creadas:")
    for est in estaciones:
        print(f"  - {est.nombre}")
    
    print("\nUsuarios de prueba disponibles:")
    print("  Usuario: ciudadano2@example.com / Test1234")
    print("  Usuario: ciudadano3@example.com / Test1234")
    print("  Usuario: investigador2@univalle.edu.co / Test1234")
    print("  Usuario: investigador3@univalle.edu.co / Test1234")
    print("  Usuario: tecnico1@example.com / Test1234")
    print("  Usuario: autoridad1@dagma.gov.co / Test1234")
    print("\nTodos comparten la contraseña: Test1234")

if __name__ == '__main__':
    main()
