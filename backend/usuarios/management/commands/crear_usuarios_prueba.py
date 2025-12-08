from django.core.management.base import BaseCommand
from usuarios.models import Usuario, AdministradorSistema, AdministradorInstitucion, AdministradorEstacion
from instituciones.models import Institucion
from estaciones.models import Estacion

class Command(BaseCommand):
    help = 'Crea usuarios de prueba para desarrollo'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('\nCreando usuarios de prueba...\n'))

        # 1. Admin del Sistema
        if not Usuario.objects.filter(email='admin@vrisa.com').exists():
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
            self.stdout.write(self.style.SUCCESS('✓ Admin Sistema creado'))
        else:
            self.stdout.write(self.style.WARNING('○ Admin Sistema ya existe'))

        # 2. Institución de prueba
        institucion, created = Institucion.objects.get_or_create(
            nombre='DAGMA',
            defaults={
                'tipo_institucion': 'publica',
                'email_contacto': 'contacto@dagma.gov.co',
                'telefono': '3185551234',
                'direccion': 'Calle 5 # 36-08, Cali',
                'estado_validacion': 'aprobada',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Institución DAGMA creada'))
        else:
            self.stdout.write(self.style.WARNING('○ Institución DAGMA ya existe'))

        # 3. Admin de Institución
        if not Usuario.objects.filter(email='admin@dagma.gov.co').exists():
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
            self.stdout.write(self.style.SUCCESS('✓ Admin Institución creado'))
        else:
            self.stdout.write(self.style.WARNING('○ Admin Institución ya existe'))

        # 4. Estación de prueba
        estacion, created = Estacion.objects.get_or_create(
            nombre='Estación Univalle Norte',
            defaults={
                'descripcion': 'Estación de monitoreo en Universidad del Valle',
                'latitud': 3.376110,
                'longitud': -76.532010,
                'direccion': 'Universidad del Valle',
                'institucion': institucion,
                'estado': 'activa',
                'estado_validacion': 'aprobada'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Estación creada'))
        else:
            self.stdout.write(self.style.WARNING('○ Estación ya existe'))

        # 5. Admin de Estación
        if not Usuario.objects.filter(email='admin@univalle.edu.co').exists():
            admin_est = Usuario.objects.create_user(
                username='admin_univalle',
                email='admin@univalle.edu.co',
                password='univalle123',
                nombre='María',
                apellido='González',
                tipo='admin_estacion'
            )
            AdministradorEstacion.objects.create(
                usuario=admin_est,
                estacion=estacion
            )
            self.stdout.write(self.style.SUCCESS('✓ Admin Estación creado'))
        else:
            self.stdout.write(self.style.WARNING('○ Admin Estación ya existe'))

        # 6. Ciudadano
        if not Usuario.objects.filter(email='ciudadano@example.com').exists():
            Usuario.objects.create_user(
                username='ciudadano1',
                email='ciudadano@example.com',
                password='ciudadano123',
                nombre='Juan',
                apellido='Pérez',
                tipo='ciudadano'
            )
            self.stdout.write(self.style.SUCCESS('✓ Ciudadano creado'))
        else:
            self.stdout.write(self.style.WARNING('○ Ciudadano ya existe'))

        # 7. Investigador
        if not Usuario.objects.filter(email='investigador@univalle.edu.co').exists():
            Usuario.objects.create_user(
                username='investigador1',
                email='investigador@univalle.edu.co',
                password='invest123',
                nombre='Laura',
                apellido='Martínez',
                tipo='investigador'
            )
            self.stdout.write(self.style.SUCCESS('✓ Investigador creado'))
        else:
            self.stdout.write(self.style.WARNING('○ Investigador ya existe'))

        self.stdout.write(self.style.SUCCESS('\n' + '='*70))
        self.stdout.write(self.style.SUCCESS('CREDENCIALES DE ACCESO:'))
        self.stdout.write(self.style.SUCCESS('='*70 + '\n'))
        
        credentials = [
            ('ADMIN SISTEMA', 'admin@vrisa.com', 'admin123', 'Gestión completa del sistema'),
            ('ADMIN INSTITUCIÓN', 'admin@dagma.gov.co', 'dagma123', 'Gestión de estaciones DAGMA'),
            ('ADMIN ESTACIÓN', 'admin@univalle.edu.co', 'univalle123', 'Gestión de sensores Univalle'),
            ('CIUDADANO', 'ciudadano@example.com', 'ciudadano123', 'Consulta pública'),
            ('INVESTIGADOR', 'investigador@univalle.edu.co', 'invest123', 'Reportes y análisis'),
        ]
        
        for i, (rol, email, password, desc) in enumerate(credentials, 1):
            self.stdout.write(f'\n{i}. {rol}')
            self.stdout.write(f'   Email: {email}')
            self.stdout.write(f'   Password: {password}')
            self.stdout.write(f'   Descripción: {desc}')
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*70 + '\n'))
