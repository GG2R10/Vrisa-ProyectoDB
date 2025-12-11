from django.apps import AppConfig


class MedicionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mediciones'
    
    def ready(self):
        # Importar signals para que se registren
        import mediciones.signals
