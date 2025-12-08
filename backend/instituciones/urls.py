from django.urls import path
from .views import (
    InstitucionListCreateView,
    InstitucionDetailView,
    ListarInstitucionesPendientesView,
    AprobarInstitucionView,
    RechazarInstitucionView
)

urlpatterns = [
    path('instituciones/', InstitucionListCreateView.as_view(), name='institucion-list-create'),
    path('instituciones/<int:pk>/', InstitucionDetailView.as_view(), name='institucion-detail'),
    
    # Listar instituciones pendientes (admin sistema)
    path('instituciones/sistema/pendientes/', ListarInstitucionesPendientesView.as_view(), name='institucion-pendientes'),
    
    # Endpoints especiales
    path('instituciones/<int:pk>/aprobar/', AprobarInstitucionView.as_view(), name='institucion-aprobar'),
    path('instituciones/<int:pk>/rechazar/', RechazarInstitucionView.as_view(), name='institucion-rechazar'),
]

