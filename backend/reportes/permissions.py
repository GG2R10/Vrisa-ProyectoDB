from rest_framework.permissions import BasePermission
from estaciones.models import Estacion
from usuarios.models import AdministradorInstitucion, AdministradorEstacion, Tecnico

class PuedeGenerarReportes(BasePermission):
    """
    Jerarquía de acceso a reportes:
    - Investigadores y Autoridades ambientales: acceso a todo
    - Administrador de institución: acceso a reportes de estaciones de su institución
    - Administrador de estación y Técnico: acceso a reportes de su estación
    - Ciudadano: acceso solo a reportes generales
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.tipo in [
            'ciudadano', 'admin_institucion', 'autoridad', 'admin_estacion', 
            'tecnico', 'admin_sistema', 'investigador'
        ]


class PuedeAccederReporteDetallado(BasePermission):
    """
    Verifica si el usuario puede acceder a reportes específicos de estaciones
    """
    
    def has_permission(self, request, view):
        user = request.user
        
        if not user.is_authenticated:
            return False
        
        # Investigadores y autoridades pueden ver todo
        if user.tipo in ['investigador', 'autoridad', 'admin_sistema']:
            return True
        
        # Ciudadanos solo pueden ver reportes generales
        if user.tipo == 'ciudadano':
            # Permite solo si es reporte general
            return request.method == 'GET' and not request.data.get('estaciones')
        
        # Otros roles pueden ver reportes detallados
        return user.tipo in ['admin_institucion', 'admin_estacion', 'tecnico']
    
    def check_estacion_access(self, user, estacion_ids):
        """
        Verifica si el usuario tiene acceso a las estaciones especificadas
        """
        if user.tipo in ['investigador', 'autoridad', 'admin_sistema']:
            return True
        
        if user.tipo == 'admin_institucion':
            try:
                admin = AdministradorInstitucion.objects.get(usuario=user)
                estaciones_permitidas = Estacion.objects.filter(
                    institucion=admin.institucion,
                    id__in=estacion_ids
                )
                return len(estaciones_permitidas) == len(estacion_ids)
            except AdministradorInstitucion.DoesNotExist:
                return False
        
        if user.tipo == 'admin_estacion':
            try:
                admin = AdministradorEstacion.objects.get(usuario=user)
                return admin.estacion.id in estacion_ids and len(estacion_ids) == 1
            except AdministradorEstacion.DoesNotExist:
                return False
        
        if user.tipo == 'tecnico':
            try:
                tecnico = Tecnico.objects.get(usuario=user)
                return tecnico.estacion.id in estacion_ids and len(estacion_ids) == 1
            except Tecnico.DoesNotExist:
                return False
        
        return False

