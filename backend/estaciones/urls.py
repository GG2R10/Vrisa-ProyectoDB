from django.urls import path
from .views import (
    EstacionListCreateView,
    EstacionDetailView,
    ListarEstacionesPendientesView,
    ListarEstacionesSistemaView,
    AprobarEstacionView,
    RechazarEstacionView,
    EliminarEstacionView,
    ModificarEstacionView
)

urlpatterns = [
    # Listar/crear estaciones
    path('estaciones/', EstacionListCreateView.as_view(), name='estacion-list-create'),

    # Detalle de estación
    path('estaciones/<int:pk>/', EstacionDetailView.as_view(), name='estacion-detail'),
    
    # Modificar estación
    path('estaciones/<int:pk>/modificar/', ModificarEstacionView.as_view(), name='estacion-modificar'),
    
    # Eliminar estación (admin sistema)
    path('estaciones/<int:pk>/eliminar/', EliminarEstacionView.as_view(), name='estacion-eliminar'),

    # Listar estaciones pendientes para admin de institución
    path('estaciones/pendientes/', ListarEstacionesPendientesView.as_view(), name='estacion-pendientes'),

    # Listar todas las estaciones (admin sistema)
    path('estaciones/sistema/todas/', ListarEstacionesSistemaView.as_view(), name='estacion-sistema-todas'),

    # Aprobar / Rechazar estación
    path('estaciones/<int:pk>/aprobar/', AprobarEstacionView.as_view(), name='estacion-aprobar'),
    path('estaciones/<int:pk>/rechazar/', RechazarEstacionView.as_view(), name='estacion-rechazar'),
]

