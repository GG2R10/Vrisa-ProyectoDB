# Cambios Realizados en el Backend - VriSA

## Fecha: 7 de diciembre de 2025

## Resumen de Modificaciones

Se han realizado las siguientes modificaciones en el backend de Django para preparar el sistema de autenticación y usuarios de prueba.

---

## 1. Sistema de Usuarios

### Estructura Implementada

El modelo de usuarios utiliza `AbstractUser` de Django con los siguientes tipos de usuario:

- **ciudadano**: Usuario general con acceso público
- **investigador**: Acceso a reportes y análisis avanzados
- **admin_sistema**: Administrador general del sistema
- **admin_institucion**: Gestión de estaciones de una institución
- **admin_estacion**: Gestión de sensores y mediciones de una estación
- **tecnico**: Personal técnico de mantenimiento
- **autoridad**: Autoridad ambiental

### Modelos Relacionados

- `AdministradorSistema`: Vincula usuario con permisos de superadministrador
- `AdministradorInstitucion`: Vincula usuario con una institución específica
- `AdministradorEstacion`: Vincula usuario con una estación específica
- `Tecnico`: Personal técnico asignado a una estación

---

## 2. Script de Usuarios de Prueba

Se creó un **Management Command** de Django para facilitar la creación de usuarios de prueba:

### Ubicación
```
backend/usuarios/management/commands/crear_usuarios_prueba.py
```

### Comando de Ejecución
```bash
python manage.py crear_usuarios_prueba
```

### Funcionalidad
- Crea usuarios de prueba para cada rol
- Crea una institución de ejemplo (DAGMA)
- Crea una estación de ejemplo (Estación Univalle Norte)
- Verifica si los usuarios ya existen antes de crearlos
- Muestra un resumen con todas las credenciales creadas

---

## 3. Datos de Prueba Creados

### Institución
- **Nombre**: DAGMA (Departamento Administrativo de Gestión del Medio Ambiente)
- **Tipo**: Pública
- **Ubicación**: Cali, Colombia
- **Estado**: Aprobada

### Estación
- **Nombre**: Estación Univalle Norte
- **Ubicación**: Universidad del Valle, Cali
- **Coordenadas**: 3.376110, -76.532010
- **Estado**: Activa y Aprobada

---

## 4. Credenciales de Acceso

Estas son las credenciales creadas por el script de usuarios de prueba:

| # | Rol | Email | Password | Descripción |
|---|-----|-------|----------|-------------|
| 1 | **Admin Sistema** | `admin@vrisa.com` | `admin123` | Gestión completa del sistema, aprobación de instituciones y estaciones, acceso a todas las funcionalidades |
| 2 | **Admin Institución** | `admin@dagma.gov.co` | `dagma123` | Gestión de estaciones de DAGMA, aprobación de nuevas estaciones de su institución |
| 3 | **Admin Estación** | `admin@univalle.edu.co` | `univalle123` | Gestión de sensores y mediciones de la Estación Univalle Norte |
| 4 | **Ciudadano** | `ciudadano@example.com` | `ciudadano123` | Consulta pública de datos de calidad del aire, acceso a mapa y reportes básicos |
| 5 | **Investigador** | `investigador@univalle.edu.co` | `invest123` | Acceso a reportes avanzados, exportación de datos, análisis estadísticos |

---

## 5. Configuraciones Pendientes

### Autenticación JWT (PENDIENTE)

Para que el frontend pueda autenticarse correctamente, es necesario:

1. **Instalar djangorestframework-simplejwt**:
```bash
pip install djangorestframework-simplejwt
```

2. **Configurar en `settings.py`**:
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework_simplejwt',
    # ...
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

3. **Agregar rutas en `urls.py`**:
```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # ... otras rutas
]
```

### CORS (PENDIENTE)

Configurar CORS para permitir peticiones desde el frontend React (puerto 3000):

1. **Instalar django-cors-headers**:
```bash
pip install django-cors-headers
```

2. **Configurar en `settings.py`**:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... otros middlewares
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## 6. Endpoints API Requeridos

Los siguientes endpoints deben estar implementados para que el frontend funcione correctamente:

### Autenticación
- `POST /api/auth/login/` - Inicio de sesión (retorna tokens JWT)
- `POST /api/auth/register/` - Registro de usuario ciudadano
- `POST /api/auth/register-institution/` - Registro de institución
- `POST /api/auth/register-station/` - Registro de estación
- `GET /api/auth/user/` - Obtener usuario actual
- `POST /api/auth/refresh/` - Refrescar token

### Instituciones
- `GET /api/instituciones/` - Listar instituciones
- `GET /api/instituciones/pendientes/` - Instituciones pendientes de aprobación
- `POST /api/instituciones/{id}/aprobar/` - Aprobar institución
- `POST /api/instituciones/{id}/rechazar/` - Rechazar institución

### Estaciones
- `GET /api/estaciones/` - Listar estaciones
- `GET /api/estaciones/activas/` - Estaciones activas
- `GET /api/estaciones/pendientes/` - Estaciones pendientes
- `POST /api/estaciones/{id}/aprobar/` - Aprobar estación
- `POST /api/estaciones/{id}/rechazar/` - Rechazar estación
- `POST /api/estaciones/` - Crear estación
- `PUT /api/estaciones/{id}/` - Actualizar estación
- `DELETE /api/estaciones/{id}/` - Eliminar estación

### Sensores
- `GET /api/sensores/` - Listar sensores
- `GET /api/sensores/estacion/{id}/` - Sensores de una estación

### Mediciones
- `GET /api/mediciones/` - Listar mediciones
- `GET /api/mediciones/estacion/{id}/` - Mediciones por estación
- `GET /api/mediciones/sensor/{id}/` - Mediciones por sensor
- `GET /api/mediciones/ultimas/{estacion_id}/` - Últimas mediciones

### Reportes
- `POST /api/reportes/general/` - Generar reporte general
- `POST /api/reportes/detallado/` - Reporte detallado por estación
- `GET /api/reportes/calidad-aire/` - Índice de calidad del aire
- `GET /api/reportes/tendencias/` - Análisis de tendencias

### Alertas
- `GET /api/alertas/activas/` - Alertas activas
- `GET /api/alertas/criticas/` - Alertas críticas
- `POST /api/alertas/{id}/resolver/` - Marcar alerta como resuelta

---

## 7. Migraciones de Base de Datos

Asegúrate de ejecutar las migraciones antes de usar el sistema:

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear usuarios de prueba
python manage.py crear_usuarios_prueba
```

---

## 8. Verificación del Sistema

Para verificar que todo funciona correctamente:

1. **Servidor de desarrollo**:
```bash
python manage.py runserver
```

2. **Probar endpoints con curl o Postman**:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vrisa.com","password":"admin123"}'
```

3. **Acceder al admin de Django**:
```
http://localhost:8000/admin/
Usuario: admin@vrisa.com
Password: admin123
```

---

## Notas Importantes

- Todas las contraseñas son de prueba y deben cambiarse en producción
- El usuario `admin@vrisa.com` tiene permisos de superusuario y puede acceder al panel de administración de Django
- Las instituciones y estaciones creadas tienen estado "aprobada" para facilitar las pruebas
- El campo `USERNAME_FIELD` del modelo Usuario está configurado como `email` en lugar de `username`

---

## Autor
Modificaciones realizadas por GitHub Copilot
Fecha: 7 de diciembre de 2025
