from django.urls import path
from .views import ReporteGeneralView, ReporteDetalladoView, EstacionesDisponiblesView, ReporteExportarView

urlpatterns = [
    # Obtener estaciones disponibles: Cualquier usuario puede solicitarlo excepto los ciudadanos, ya que estos no tienen acceso a reportes detallados
    path('estaciones_disponibles/', EstacionesDisponiblesView.as_view(), name='lista_estaciones_disponibles'),

    # Reporte general: cualquier usuario puede solicitarlo, no necesita enviar estaciones
    path('general/', ReporteGeneralView.as_view(), name='reporte_general'),

    # Reporte detallado: usuario envía la lista de estaciones, se valida permisos
    path('detallado/', ReporteDetalladoView.as_view(), name='reporte_detallado'),

    # Exportar reporte como archivo
    path('exportar/', ReporteExportarView.as_view(), name='reporte_exportar'),
]
