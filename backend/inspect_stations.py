import os
import sys
import django

# Add the current directory to sys.path to allow module imports
sys.path.append(os.getcwd())

# Correct settings module based on manage.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_estaciones.settings')
django.setup()

from estaciones.models import Estacion

def inspect_stations():
    try:
        stations = Estacion.objects.all()
        print(f"Encontradas {stations.count()} estaciones:")
        print("-" * 80)
        print(f"{'ID':<4} | {'Nombre':<30} | {'Latitud':<15} | {'Longitud':<15}")
        print("-" * 80)
        for s in stations:
            # Handle potential None values for printing
            lat = str(s.ubicacion_latitud) if s.ubicacion_latitud is not None else "None"
            lon = str(s.ubicacion_longitud) if s.ubicacion_longitud is not None else "None"
            print(f"{s.id:<4} | {s.nombre:<30} | {lat:<15} | {lon:<15}")
            
    except Exception as e:
        print(f"Error inspecting stations: {e}")

if __name__ == "__main__":
    inspect_stations()
