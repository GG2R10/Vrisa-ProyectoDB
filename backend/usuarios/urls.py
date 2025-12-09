from rest_framework import routers
from django.urls import path, include
from .views import (
    UsuarioViewSet, 
    CurrentUserDetailView,
    CustomTokenObtainPairView,
    SolicitudInvestigadorCreateView,
    SolicitudAutoridadCreateView,
    ListarSolicitudesInvestigadorView,
    ListarSolicitudesAutoridadView,
    AprobarSolicitudInvestigadorView,
    RechazarSolicitudInvestigadorView,
    AprobarSolicitudAutoridadView,
    RechazarSolicitudAutoridadView
)

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('usuarios/me/', CurrentUserDetailView.as_view(), name='current-user'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('solicitudes/investigador/crear/', SolicitudInvestigadorCreateView.as_view(), name='crear-solicitud-investigador'),
    path('solicitudes/autoridad/crear/', SolicitudAutoridadCreateView.as_view(), name='crear-solicitud-autoridad'),
    path('solicitudes/investigador/', ListarSolicitudesInvestigadorView.as_view(), name='listar-solicitudes-investigador'),
    path('solicitudes/autoridad/', ListarSolicitudesAutoridadView.as_view(), name='listar-solicitudes-autoridad'),
    path('solicitudes/investigador/<int:pk>/aprobar/', AprobarSolicitudInvestigadorView.as_view(), name='aprobar-investigador'),
    path('solicitudes/investigador/<int:pk>/rechazar/', RechazarSolicitudInvestigadorView.as_view(), name='rechazar-investigador'),
    path('solicitudes/autoridad/<int:pk>/aprobar/', AprobarSolicitudAutoridadView.as_view(), name='aprobar-autoridad'),
    path('solicitudes/autoridad/<int:pk>/rechazar/', RechazarSolicitudAutoridadView.as_view(), name='rechazar-autoridad'),
]

