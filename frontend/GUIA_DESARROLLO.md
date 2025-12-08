# VriSA - Guía de Desarrollo Frontend

## 📋 Resumen de Cambios Realizados

### ✅ Migración Completada: Tailwind → Bootstrap

Se ha completado exitosamente la migración de Tailwind CSS a Bootstrap 5 y React-Bootstrap. Los cambios incluyen:

1. **Dependencias actualizadas:**
   - ❌ Removido: `tailwindcss`, `postcss`, `autoprefixer`
   - ✅ Instalado: `bootstrap`, `react-bootstrap`

2. **Componentes migrados a Bootstrap:**
   - `Navbar.js` - Usa componentes de React-Bootstrap
   - `Sidebar.js` - Implementa Offcanvas para móviles
   - `Login.js` - Usa Form, Card, Container
   - `Dashboard.js` - Usa Grid System y Cards
   - `MapComponent.js` - Adaptado con clases de Bootstrap
   - `MainLayout.js` - Actualizado con clases de Bootstrap

3. **Servicios API con Axios:**
   Se crearon 7 servicios organizados para interactuar con el backend:
   - `authService.js` - Autenticación y registro
   - `institucionService.js` - Gestión de instituciones
   - `estacionService.js` - Gestión de estaciones
   - `medicionService.js` - Gestión de mediciones
   - `reporteService.js` - Generación de reportes
   - `alertaService.js` - Gestión de alertas
   - `sensorService.js` - Gestión de sensores

4. **AuthContext actualizado:**
   - Ahora usa `authService` en lugar de llamadas directas
   - Incluye métodos para registro de instituciones y estaciones

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Instalar dependencias (si no lo has hecho)
```powershell
cd frontend
npm install
```

### 2. Iniciar el servidor de desarrollo
```powershell
npm start
```

El frontend se ejecutará en `http://localhost:3000`

### 3. Backend (Django)
Asegúrate de que el backend esté corriendo en `http://localhost:8000`

```powershell
cd backend
python manage.py runserver
```

---

## 📚 Uso de los Servicios de Axios

### Ejemplo Básico

```javascript
import estacionService from '../services/estacionService';

// En tu componente
const MiComponente = () => {
    const [estaciones, setEstaciones] = useState([]);

    useEffect(() => {
        cargarEstaciones();
    }, []);

    const cargarEstaciones = async () => {
        try {
            const data = await estacionService.getActivas();
            setEstaciones(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        // Tu JSX aquí
    );
};
```

### Servicios Disponibles

#### 📌 authService
```javascript
// Login
await authService.login(username, password);

// Registro de ciudadano
await authService.register(userData);

// Registro de institución
await authService.registerInstitution(institutionData);

// Obtener usuario actual
await authService.getCurrentUser();

// Logout
authService.logout();
```

#### 📌 estacionService
```javascript
// Obtener todas las estaciones
await estacionService.getAll();

// Obtener estaciones activas
await estacionService.getActivas();

// Crear estación
await estacionService.create(data);

// Aprobar estación
await estacionService.aprobar(id);

// Rechazar estación
await estacionService.rechazar(id, motivo);
```

#### 📌 medicionService
```javascript
// Obtener mediciones por estación
await medicionService.getByEstacion(estacionId);

// Obtener últimas mediciones
await medicionService.getUltimasByEstacion(estacionId, limit);

// Crear medición
await medicionService.create(data);
```

#### 📌 reporteService
```javascript
// Generar reporte general
await reporteService.generarReporteGeneral(params);

// Reporte de calidad del aire
await reporteService.getReporteCalidadAire(estacionId, fechaInicio, fechaFin);
```

#### 📌 alertaService
```javascript
// Obtener alertas activas
await alertaService.getActivas();

// Obtener alertas críticas
await alertaService.getCriticasActivas();

// Marcar como resuelta
await alertaService.marcarResuelta(id);
```

---

## 🎨 Componentes de Bootstrap Disponibles

### Componentes Principales
- **Container, Row, Col** - Sistema de Grid
- **Card** - Tarjetas de contenido
- **Button** - Botones con variantes
- **Form** - Formularios con validación
- **Alert** - Mensajes de alerta
- **Badge** - Etiquetas/badges
- **Table** - Tablas responsive
- **Spinner** - Indicadores de carga
- **Modal** - Ventanas modales
- **Navbar** - Barra de navegación
- **Offcanvas** - Panel lateral para móviles

### Ejemplo de Uso
```javascript
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

<Container>
    <Row>
        <Col md={6}>
            <Card>
                <Card.Body>
                    <Card.Title>Título</Card.Title>
                    <Card.Text>Contenido</Card.Text>
                    <Button variant="primary">Acción</Button>
                </Card.Body>
            </Card>
        </Col>
    </Row>
</Container>
```

---

## 📋 Próximos Pasos Sugeridos

### 1. Completar Páginas de Registro (Alta Prioridad)
- **RegisterInstitution.js** - Formulario completo con:
  - Nombre, descripción, logo
  - Colores personalizados
  - Tipo de institución
  - Usar `authService.registerInstitution()`

- **RegisterStation.js** - Formulario con:
  - Nombre, ubicación (mapa interactivo)
  - Latitud/Longitud
  - Institución asociada
  - Usar `authService.registerStation()`

### 2. Implementar Dashboard de Administrador
- **AdminDashboard.js** - Panel para admin del sistema:
  - Lista de instituciones pendientes
  - Botones aprobar/rechazar
  - Usar `institucionService.getPendientes()`
  - Usar `institucionService.aprobar(id)` / `.rechazar(id)`

### 3. Crear Gestión de Estaciones
- **EstacionesPage.js** - Para admin de institución:
  - Lista de estaciones de su institución
  - Aprobar/rechazar estaciones
  - Asignar técnicos
  - Usar `estacionService.getByInstitution()`

### 4. Implementar Visualización de Mediciones
- **MedicionesPage.js**:
  - Gráficas con Chart.js o Recharts
  - Filtros por fecha y tipo de medición
  - Vista en tiempo real
  - Usar `medicionService.getByEstacion()`

### 5. Crear Sistema de Reportes
- **ReportesPage.js**:
  - Formulario para generar reportes
  - Selección de tipo de reporte
  - Filtros de fecha y estación
  - Exportar a PDF/Excel
  - Usar `reporteService.generarReporteGeneral()`

### 6. Implementar Gestión de Sensores
- **SensoresPage.js**:
  - CRUD de sensores
  - Asociar a estaciones
  - Configurar variables medibles
  - Usar `sensorService.*`

---

## 🔧 Configuración del Backend Pendiente

### 1. Instalar Dependencias
```powershell
cd backend
pip install djangorestframework django-cors-headers djangorestframework-simplejwt
```

### 2. Actualizar `settings.py`
```python
INSTALLED_APPS = [
    # ... apps existentes ...
    'rest_framework',
    'corsheaders',
    'reportes',  # Agregar esta app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Al inicio
    # ... resto del middleware ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

### 3. Actualizar `urls.py`
```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # ... rutas existentes ...
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/', include('usuarios.urls')),
]
```

### 4. Crear `usuarios/urls.py` (si no existe)
```python
from django.urls import path
from .views import UsuarioViewSet

urlpatterns = [
    path('me/', UsuarioViewSet.as_view({'get': 'me'}), name='usuario-me'),
    # Otras rutas...
]
```

---

## 📖 Estructura del Proyecto Recomendada

```
frontend/src/
├── components/
│   ├── alertas/
│   │   └── AlertasList.js  ✅ (CREADO)
│   ├── estaciones/
│   │   ├── EstacionList.js
│   │   ├── EstacionForm.js
│   │   └── EstacionCard.js
│   ├── instituciones/
│   │   ├── InstitucionList.js
│   │   └── InstitucionCard.js
│   ├── mediciones/
│   │   ├── GraficaMediciones.js
│   │   └── TablaMediciones.js
│   ├── reportes/
│   │   ├── ReporteForm.js
│   │   └── ReporteViewer.js
│   ├── sensores/
│   │   ├── SensorList.js
│   │   └── SensorForm.js
│   ├── MapComponent.js  ✅
│   ├── Navbar.js        ✅
│   └── Sidebar.js       ✅
├── services/  ✅ (TODOS CREADOS)
│   ├── authService.js
│   ├── estacionService.js
│   ├── institucionService.js
│   ├── medicionService.js
│   ├── reporteService.js
│   ├── alertaService.js
│   └── sensorService.js
├── pages/
│   ├── auth/
│   │   ├── Login.js              ✅
│   │   ├── RegisterInstitution.js (PENDIENTE)
│   │   └── RegisterStation.js     (PENDIENTE)
│   ├── admin/
│   │   └── AdminDashboard.js     (PENDIENTE)
│   ├── public/
│   │   └── Dashboard.js          ✅
│   ├── EstacionesPage.js         (PENDIENTE)
│   ├── MedicionesPage.js         (PENDIENTE)
│   └── ReportesPage.js           (PENDIENTE)
└── context/
    ├── AuthContext.js   ✅
    └── ThemeContext.js  ✅
```

---

## 🐛 Troubleshooting

### Error: "Module not found: Can't resolve 'bootstrap'"
```powershell
npm install bootstrap react-bootstrap
```

### Error: "Axios network error"
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Verifica la configuración de CORS en Django

### Error: "Token expired"
- El token JWT expira después de 5 horas
- Implementar lógica de refresh token en `client.js`

---

## 📞 Contacto y Recursos

- **Documentación Bootstrap:** https://getbootstrap.com/docs/5.3
- **Documentación React-Bootstrap:** https://react-bootstrap.github.io
- **Documentación Axios:** https://axios-http.com
- **Documentación React Leaflet:** https://react-leaflet.js.org

---

## ✅ Checklist de Tareas

- [x] Migrar de Tailwind a Bootstrap
- [x] Crear servicios de Axios
- [x] Actualizar AuthContext
- [x] Migrar componentes principales
- [x] Completar RegisterInstitution.js
- [x] Completar RegisterStation.js
- [ ] Implementar AdminDashboard.js
- [ ] Crear EstacionesPage.js
- [ ] Crear MedicionesPage.js con gráficas
- [ ] Crear ReportesPage.js
- [ ] Implementar SensoresPage.js
- [ ] Configurar autenticación JWT en backend
- [ ] Agregar validaciones de formularios
- [ ] Implementar manejo de errores global
- [ ] Agregar tests unitarios
- [ ] Optimizar rendimiento

---

**¡Buen trabajo! El proyecto está ahora con Bootstrap y listo para continuar el desarrollo.** 🚀
