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
    """Crear sensores de prueba para calidad del aire"""
    print("\nCreando sensores...")
    
    # Configuraciones de sensores realistas para calidad del aire
    configuraciones_sensores = [
        {
            'tipo': 'variables',
            'variables': ['temperatura', 'humedad', 'velocidad_viento', 'direccion_viento'],
            'unidad': 'multiple'
        },
        {
            'tipo': 'concentraciones',
            'variables': ['PM25', 'NO2', 'SO2'],
            'unidad': 'µg/m³'
        },
        {
            'tipo': 'concentraciones',
            'variables': ['O3', 'CO'],
            'unidad': 'ppm'
        },
    ]
    
    sensores = []
    ahora = timezone.now()
    
    for estacion in estaciones:
        # Crear 2-3 sensores por estación con diferentes tipos
        for i, config in enumerate(configuraciones_sensores[:2 + (hash(estacion.nombre) % 2)]):
            sensor, created = Sensor.objects.get_or_create(
                estacion=estacion,
                tipo=config['tipo'],
                defaults={
                    'unidad_de_medida': config['unidad'],
                    'fecha_calibracion': (ahora - timedelta(days=random.randint(30, 180))).date(),
                    'variables_medibles': config['variables'],
                }
            )
            if created:
                print(f"  ✓ Creado sensor {config['tipo']} en {estacion.nombre}")
                print(f"    Variables: {', '.join(config['variables'])}")
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
    """Crear mediciones de prueba para cada sensor"""
    print("\nCreando mediciones dummy...")
    
    ahora = timezone.now()
    count = 0
    
    # Rangos realistas para cada tipo de variable
    rangos_valores = {
        'temperatura': (15, 35),  # °C
        'humedad': (30, 95),  # %
        'velocidad_viento': (0, 15),  # m/s
        'direccion_viento': (0, 360),  # grados
        'PM25': (5, 150),  # µg/m³ - puede ser alto en Cali
        'NO2': (10, 200),  # µg/m³
        'SO2': (5, 100),  # µg/m³
        'O3': (20, 180),  # µg/m³
        'CO': (0.1, 5.0),  # ppm
    }
    
    for sensor in sensores:
        # Crear mediciones para cada variable que el sensor puede medir
        for variable in sensor.variables_medibles:
            # Crear 50 mediciones por variable en los últimos 30 días
            for i in range(50):
                # Distribuir las mediciones a lo largo de 30 días
                dias_atras = random.randint(0, 30)
                horas = random.randint(0, 23)
                minutos = random.randint(0, 59)
                fecha_hora = ahora - timedelta(days=dias_atras, hours=horas, minutes=minutos)
                
                # Generar valor realista según el tipo de variable
                if variable in rangos_valores:
                    min_val, max_val = rangos_valores[variable]
                    # Añadir algo de variación temporal (valores más altos en ciertas horas)
                    if variable == 'temperatura':
                        # Temperatura más alta al mediodía
                        factor_hora = 1 + 0.3 * abs(12 - fecha_hora.hour) / 12
                        valor = random.uniform(min_val, max_val) * factor_hora
                    elif variable in ['PM25', 'NO2', 'CO']:
                        # Contaminación más alta en horas pico (7-9 AM, 5-7 PM)
                        hora = fecha_hora.hour
                        if (7 <= hora <= 9) or (17 <= hora <= 19):
                            valor = random.uniform(min_val + (max_val - min_val) * 0.3, max_val)
                        else:
                            valor = random.uniform(min_val, max_val * 0.7)
                    else:
                        valor = random.uniform(min_val, max_val)
                    
                    # Redondear según el tipo
                    if variable in ['temperatura', 'humedad', 'velocidad_viento']:
                        valor = round(valor, 2)
                    elif variable == 'direccion_viento':
                        valor = round(valor, 0)
                    elif variable == 'CO':
                        valor = round(valor, 3)
                    else:
                        valor = round(valor, 1)
                else:
                    valor = round(random.uniform(0, 100), 2)
                
                # Crear la medición
                medicion, created = Medicion.objects.get_or_create(
                    sensor=sensor,
                    tipo=variable,
                    fecha_hora=fecha_hora,
                    defaults={'valor': valor}
                )
                
                if created:
                    count += 1
    
    print(f"  ✓ Creadas {count} mediciones")
    print(f"  ✓ Distribución: ~50 mediciones por variable por sensor")
    print(f"  ✓ Rango temporal: últimos 30 días")

def main():
    print("=" * 50)
    print("GENERADOR DE DATOS DE PRUEBA (SEEDS)")
    print("=" * 50)
    
    instituciones = crear_instituciones()
    estaciones = crear_estaciones(instituciones)
    sensores = crear_sensores(estaciones)
    usuarios = crear_usuarios_prueba()
    crear_mediciones_dummy(sensores)
    
    print("\n" + "=" * 50)
    print("✓ DATOS DE PRUEBA CREADOS EXITOSAMENTE")
    print("=" * 50)
    print("\nInstituciones creadas:")
    for inst in instituciones:
        print(f"  - {inst.nombre}")
    
    print("\nEstaciones creadas:")
    for est in estaciones:
        print(f"  - {est.nombre}")
    
    print(f"\nSensores creados: {len(sensores)}")
    print("  (Cada estación tiene 2-3 sensores con múltiples variables)")
    
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
