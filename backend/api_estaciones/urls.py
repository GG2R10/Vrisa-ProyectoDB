"""
URL configuration for api_estaciones project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('usuarios.urls')),
    path('', include('instituciones.urls')),
    path('', include('estaciones.urls')),
    path('sensores/', include('sensores.urls')),
    path('mediciones/', include('mediciones.urls')),
    path('alertas/', include('alertas.urls')),
    path('reportes/', include('reportes.urls'))
]

# Para Media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
