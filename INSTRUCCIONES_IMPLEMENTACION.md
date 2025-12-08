# Instrucciones de Implementación y Próximos Pasos

## 🚀 Pasos Inmediatos para Activar el Sistema

### 1. **Crear y Ejecutar Migraciones de Django**

```bash
cd backend/
python manage.py makemigrations usuarios
python manage.py makemigrations instituciones
python manage.py makemigrations estaciones
python manage.py migrate
```

**Verificar que todas las migraciones se ejecuten correctamente**

### 2. **Crear Usuario Admin del Sistema**

```bash
python manage.py createsuperuser
# Luego actualizar su tipo a 'admin_sistema':
python manage.py shell
```

```python
from usuarios.models import Usuario, AdministradorSistema
admin_user = Usuario.objects.get(username='admin')
admin_user.tipo = 'admin_sistema'
admin_user.save()
AdministradorSistema.objects.create(usuario=admin_user, super_admin=True)
```

### 3. **Verificar CORS y JWT en settings.py**

Asegúrate de tener en `api_estaciones/settings.py`:

```python
# Añadir a INSTALLED_APPS si no están:
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    ...
]

# Configuración de CORS
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]

# Configuración REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### 4. **Configurar JWT en urls.py del Backend**

Si no está configurado, agregar en `api_estaciones/urls.py`:

```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    ...
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

### 5. **Instalar Dependencias de Frontend**

```bash
cd frontend/
npm install
```

### 6. **Actualizar API Client en Frontend**

Verificar que `src/api/client.js` esté configurado correctamente:

```javascript
import axios from 'axios';

const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
```

### 7. **Iniciar Servidor de Desarrollo**

**Backend:**
```bash
cd backend/
python manage.py runserver
```

**Frontend (nueva terminal):**
```bash
cd frontend/
npm start
```

---

## 📋 Flujos de Prueba Manual

### Flujo 1: Registrar y Solicitar Investigador

1. Ir a `http://localhost:3000/register`
2. Llenar formulario con:
   - nombre, apellido, username, email, contraseña
   - Marcar "¿Quieres registrarte como investigador?"
3. Hacer click en "Crear cuenta"
4. Iniciar sesión con las credenciales
5. Ir a "Mis Opciones" desde el sidebar
6. En tab "Solicitud de Investigador", hacer click en "Enviar solicitud"
7. Ir a `/admin/sistema` con usuario admin
8. En tab "Solicitudes de Investigador", aprobar la solicitud
9. Verificar que el usuario ahora es investigador

### Flujo 2: Crear Institución

1. Como ciudadano, ir a "Mis Opciones"
2. Tab "Registrar Institución"
3. Llenar datos:
   - Nombre: "Mi Institución"
   - Dirección: "Calle 1"
   - Colores: seleccionar colores
4. Click en "Registrar institución"
5. Ir a admin sistema (`/admin/sistema`)
6. Tab "Instituciones Pendientes"
7. Aprobar la institución
8. Verificar que el usuario se convirtió en admin_institucion
9. Verificar que los colores se aplican en la interfaz

### Flujo 3: Crear Estación

1. Como ciudadano, ir a "Mis Opciones"
2. Tab "Registrar Estación"
3. Llenar datos con coordenadas válidas
4. Seleccionar institución y técnico (otro usuario)
5. Click en "Registrar estación"
6. Cambiar a admin de institución
7. Ver estación pendiente
8. Aprobar estación
9. Verificar que:
   - Usuario creador es ahora admin_estacion
   - Usuario técnico es ahora tecnico

---

## 🔧 Configuraciones Adicionales Recomendadas

### 1. **Email Backend para Notificaciones**

Agregar en `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Para desarrollo
# O usar SendGrid/Gmail en producción
```

### 2. **Logging para Debugging**

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### 3. **Rate Limiting en Endpoints**

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

---

## 📦 Próximas Características para Implementar

### Alta Prioridad

- [ ] **Validación de Permisos en Reportes**
  - Implementar la lógica de jerarquía completa
  - Filtrar datos según el rol
  
- [ ] **Modal de Edición en Admin**
  - Agregar modal para modificar estaciones
  - Actualizar datos dinámicamente

- [ ] **Búsqueda y Filtrado**
  - Implementar búsqueda en tablas
  - Filtros por estado, institución, fecha

- [ ] **Validación de Email Único**
  - Agregar validación en backend
  - Mostrar error en frontend

### Media Prioridad

- [ ] **Recuperación de Contraseña**
  - Email de recuperación
  - Token de reset
  
- [ ] **Paginación en Listados**
  - Implementar en endpoints
  - Actualizar frontend

- [ ] **Validación de Permisos Granular**
  - Check en cada operación
  - Tests de permisos

- [ ] **Dashboard Estadístico**
  - Gráficos de actividad
  - Métricas de usuarios

### Baja Prioridad

- [ ] **Exportar Reportes a PDF**
  - Usar reportlab
  
- [ ] **Mapas Interactivos**
  - Mejorar MapComponent
  
- [ ] **Historial de Cambios**
  - Auditoría de cambios

---

## 🧪 Pruebas a Realizar

### Tests Backend

```bash
python manage.py test usuarios.tests
python manage.py test instituciones.tests
python manage.py test estaciones.tests
```

### Tests Frontend

```bash
npm test
```

### Tests de Integración

- [ ] Flujo completo de registro
- [ ] Solicitud y aprobación de investigador
- [ ] Creación de institución
- [ ] Creación de estación
- [ ] Cambio de colores según rol
- [ ] Permisos de reportes

---

## 🔍 Debugging Common Issues

### Problema: 404 en endpoints

**Solución:**
1. Verificar que las URLs están correctamente incluidas en `urls.py`
2. Revisar nombres de los endpoints
3. Verificar que la app está en INSTALLED_APPS

### Problema: 401 Unauthorized

**Solución:**
1. Verificar que el token se está guardando en localStorage
2. Revisar que el interceptor de axios está agregando el token
3. Verificar que el token no ha expirado

### Problema: 403 Forbidden

**Solución:**
1. Verificar que el usuario tiene el rol correcto
2. Revisar la lógica de permisos en views.py
3. Verificar que las relaciones OneToOne están correctas

### Problema: Colores no se aplican

**Solución:**
1. Verificar que `applyUserTheme()` se está llamando en AuthContext
2. Revisar que los colores se están guardando en localStorage
3. Verificar las variables CSS en App.css

---

## 📚 Recursos Útiles

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [React Router Docs](https://reactrouter.com/)
- [Bootstrap React Docs](https://react-bootstrap.github.io/)
- [JWT en Django](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Axios Documentation](https://axios-http.com/)

---

## 📞 Soporte y Dudas

Si encuentras problemas:

1. Revisar los logs del backend: `python manage.py runserver`
2. Abrir consola del navegador (F12) para ver errores del frontend
3. Revisar la sección de Debugging Common Issues arriba
4. Verificar que todas las migraciones se ejecutaron correctamente

---

## ✅ Checklist de Implementación

- [ ] Migraciones ejecutadas
- [ ] Usuario admin del sistema creado
- [ ] CORS configurado
- [ ] JWT configurado
- [ ] Frontend actualizado
- [ ] Servidor backend running
- [ ] Servidor frontend running
- [ ] Flujo de registro probado
- [ ] Flujo de investigador probado
- [ ] Flujo de institución probado
- [ ] Flujo de estación probado
- [ ] Permisos validados
- [ ] Colores institucionales funcionando

---

**Documento actualizado**: Diciembre 8, 2025
**Última revisión**: Implementación completa
