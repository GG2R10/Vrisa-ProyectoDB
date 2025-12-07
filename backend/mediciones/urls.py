from django.urls import path
from .views import MedicionListCreateView, MedicionDetailView

urlpatterns = [
    path('', MedicionListCreateView.as_view(), name='medicion-list-create'),
    path('<int:pk>/', MedicionDetailView.as_view(), name='medicion-detail'),
]
