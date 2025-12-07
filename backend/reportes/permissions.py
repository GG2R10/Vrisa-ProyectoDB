from rest_framework.permissions import BasePermission

class PuedeGenerarReportes(BasePermission):
    """
    - Ciudadano solo puede ver reportes globales
    - Institución solo puede ver estaciones de su institución
    - Autoridad ambiental puede ver todo
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        return user.rol in ['ciudadano', 'admin_institucion', 'autoridad', 'admin_estacion', 'tecnico', 'admin_sistema']
