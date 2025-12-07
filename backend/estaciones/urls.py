from django.urls import path
from .views import (
    EstacionListCreateView,
    EstacionDetailView,
    AprobarEstacionView,
    RechazarEstacionView
)

urlpatterns = [
    # Listar/crear estaciones para una institución
    path('instituciones/<int:id_institucion>/estaciones/', EstacionListCreateView.as_view(), name='estacion-list-create'),

    # Detalle de estación
    path('instituciones/<int:id_institucion>/estaciones/<int:pk>/', EstacionDetailView.as_view(), name='estacion-detail'),

    # Aprobar / Rechazar estación
    path('instituciones/<int:id_institucion>/estaciones/<int:pk>/aprobar/', AprobarEstacionView.as_view(), name='estacion-aprobar'),
    path('instituciones/<int:id_institucion>/estaciones/<int:pk>/rechazar/', RechazarEstacionView.as_view(), name='estacion-rechazar'),
]
