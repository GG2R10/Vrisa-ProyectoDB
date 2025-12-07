from django.urls import path
from .views import (
    InstitucionListCreateView,
    InstitucionDetailView,
    AprobarInstitucionView,
    RechazarInstitucionView
)

urlpatterns = [
    path('', InstitucionListCreateView.as_view(), name='institucion-list-create'),
    path('<int:pk>/', InstitucionDetailView.as_view(), name='institucion-detail'),
    
    # Endpoints especiales
    path('<int:pk>/aprobar/', AprobarInstitucionView.as_view(), name='institucion-aprobar'),
    path('<int:pk>/rechazar/', RechazarInstitucionView.as_view(), name='institucion-rechazar'),
]
