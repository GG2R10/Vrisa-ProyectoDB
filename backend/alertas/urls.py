from django.urls import path
from .views import AlertaListCreateView, AlertaDetailView

urlpatterns = [
    path('', AlertaListCreateView.as_view(), name='alerta-list-create'),
    path('<int:pk>/', AlertaDetailView.as_view(), name='alerta-detail'),
]