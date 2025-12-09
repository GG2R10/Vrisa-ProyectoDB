# VriSA - Guía de Desarrollo Frontend

**Última actualización: 7 de diciembre de 2025**

---

## 📋 Resumen Ejecutivo

Frontend completamente migrado de Tailwind CSS a Bootstrap 5 con React-Bootstrap. Se implementaron 7 servicios Axios completos, 8 páginas funcionales, sistema de autenticación con JWT, y componentes reutilizables con diseño moderno y responsive.

---

## 🛠 Stack Tecnológico

### Framework y Librerías Core
- **React 19.2.0** - Framework principal
- **React Router DOM 7.1.1** - Enrutamiento SPA
- **Bootstrap 5.3.3** + **React-Bootstrap 2.10.6** - Framework UI

### Gestión de Datos
- **Axios 1.13.2** - Cliente HTTP con interceptores JWT
- **React Context API** - Estado global (AuthContext, ThemeContext)

### Visualización
- **Recharts 3.5.1** - Gráficas interactivas (línea, barras, área)
- **React Leaflet 5.0.0** - Mapas con Leaflet 1.9.4
- **Lucide-react 0.556.0** - Sistema de iconos

---

## 📁 Estructura del Proyecto

```
frontend/src/
├── api/
│   └── client.js                    # Cliente Axios + interceptores JWT
├── components/
│   ├── alertas/AlertasList.js       # Lista de alertas (ejemplo)
│   ├── MapComponent.js              # Mapa interactivo con marcadores
│   ├── Navbar.js                    # Barra superior con auth
│   └── Sidebar.js                   # Menú lateral responsive
├── context/
│   ├── AuthContext.js               # Estado de autenticación
│   └── ThemeContext.js              # Temas y colores
├── layouts/
│   └── MainLayout.js                # Layout base con Navbar/Sidebar
├── pages/
│   ├── admin/
│   │   └── AdminDashboard.js        # ✅ Panel admin (tabs, modales, aprobaciones)
│   ├── auth/
│   │   ├── Login.js                 # ✅ Login (diseño amplio, 2 columnas)
│   │   ├── RegisterInstitution.js   # ✅ Wizard 2 pasos (institución + admin)
│   │   └── RegisterStation.js       # ✅ Registro estación + GPS
│   ├── estaciones/
│   │   └── EstacionesPage.js        # ✅ CRUD estaciones + búsqueda/filtros
│   ├── mediciones/
│   │   └── MedicionesPage.js        # ✅ Gráficas + estadísticas + exportar
│   ├── public/
│   │   └── Dashboard.js             # ✅ Dashboard público con mapa
│   └── reportes/
│       └── ReportesPage.js          # ✅ 5 tipos reportes (PDF/CSV/JSON)
├── services/
│   ├── alertaService.js             # ✅ 10 métodos
│   ├── authService.js               # ✅ 7 métodos
│   ├── estacionService.js           # ✅ 11 métodos
│   ├── institucionService.js        # ✅ 11 métodos
│   ├── medicionService.js           # ✅ 9 métodos
│   ├── reporteService.js            # ✅ 10 métodos
│   └── sensorService.js             # ✅ 8 métodos
├── App.js                           # Rutas principales
├── index.js                         # Entry point
└── index.css                        # Bootstrap import + estilos globales
```

---

## 🔐 Sistema de Autenticación

### AuthContext

**Ubicación:** `src/context/AuthContext.js`

**Estado Global:**
```javascript
{
  user: {
    id, email, nombre, apellido, rol, institucion_id, estacion_id
  },
  loading: boolean
}
```

**Métodos Disponibles:**
- `login(username, password)` - Autenticación con JWT
- `logout()` - Cerrar sesión
- `register(userData)` - Registro ciudadano
- `registerInstitution(data)` - Registro institución + admin
- `registerStation(data)` - Registro estación + admin

### Cliente Axios

**Ubicación:** `src/api/client.js`

**Características:**
- ✅ Interceptor de request: agrega Bearer token automáticamente
- ✅ Interceptor de response: refresca token en 401
- ✅ Retry automático de peticiones fallidas
- ✅ Redirección a /login si refresh falla

---

## 🌐 Servicios API Implementados

### 1. authService.js (7 métodos)
```javascript
login(username, password)
register(userData)
registerInstitution(institutionData)
registerStation(stationData)
getCurrentUser()
refreshToken()
logout()
```

### 2. institucionService.js (11 métodos)
```javascript
getAll(filters)
getById(id)
create(data)
update(id, data)
delete(id)
aprobar(id)
rechazar(id, razon)
getPendientes()
getAprobadas()
getRechazadas()
getByTipo(tipo)
```

### 3. estacionService.js (11 métodos)
```javascript
getAll(filters)
getById(id)
getActivas()
getByInstitution(institucionId)
create(data)
update(id, data)
delete(id)
aprobar(id)
rechazar(id, razon)
getPendientes()
getByEstado(estado)
```

### 4. medicionService.js (9 métodos)
```javascript
getAll(filters)
getBySensor(sensorId, filters)
getByEstacion(estacionId, filters)
getByTipo(tipo, filters)
getByDateRange(estacionId, fechaInicio, fechaFin, tipo)
getUltimasByEstacion(estacionId)
getPromediosByPeriodo(estacionId, periodo)
getEstadisticas(estacionId, fechaInicio, fechaFin)
create(data)
```

### 5. sensorService.js (8 métodos)
```javascript
getAll()
getById(id)
getByEstacion(estacionId)
getByTipo(tipo)
create(data)
update(id, data)
delete(id)
calibrar(id, datos)
```

### 6. alertaService.js (10 métodos)
```javascript
getAll(filters)
getActivas()
getCriticasActivas()
getByEstacion(estacionId)
getByTipo(tipo)
getById(id)
create(data)
marcarResuelta(id, comentarios)
getHistorico(fechaInicio, fechaFin)
getEstadisticas()
```

### 7. reporteService.js (10 métodos)
```javascript
generarReporteGeneral(fechaInicio, fechaFin, formato)
generarReporteDetallado(estacionId, fechaInicio, fechaFin, formato)
getReporteCalidadAire(estacionId, fechaInicio, fechaFin)
getReporteTendencias(tipoContaminante, fechaInicio, fechaFin, estacionId)
getReporteComparativo(fechaInicio, fechaFin, institucionId)
getReportePorHora(estacionId, fecha)
getReporteEstadistico(estacionId, periodo)
exportarDatos(params, formato)
getProgramados()
programarReporte(config)
```

**Total:** 66 métodos implementados ✅

---

## 🎨 Páginas Desarrolladas

### 1. Login.js
**Ruta:** `/login`

**Características:**
- Diseño amplio (Col xl={6})
- InputGroup con iconos
- Mensajes de error
- Loading states
- Enlaces a registro

### 2. RegisterInstitution.js
**Ruta:** `/register-institution`

**Características:**
- **Wizard 2 pasos** con ProgressBar
- **Paso 1:** Datos institución (nombre, tipo, contacto, logo, colores)
- **Paso 2:** Admin (username, email, password)
- File upload con preview
- Color pickers con hex display
- Validación por paso
- Pantalla de éxito

### 3. RegisterStation.js
**Ruta:** `/register-station`

**Características:**
- Formulario completo single-page
- Selector de institución (carga aprobadas)
- Coordenadas GPS + botón ubicación actual
- Checkboxes sensores con badges
- Sección admin integrada
- Validación completa

### 4. AdminDashboard.js
**Ruta:** `/admin/dashboard`
**Rol:** `admin_sistema`

**Características:**
- **Tabs:** Instituciones / Estaciones
- Tablas con paginación
- Botones aprobar/rechazar
- Modal con formulario de rechazo
- Estados de carga
- Badges de cantidad pendiente

### 5. EstacionesPage.js
**Ruta:** `/estaciones`

**Características:**
- **CRUD completo** (crear, leer, actualizar, eliminar)
- Búsqueda por nombre/ubicación
- Filtros por estado
- Modal crear/editar/ver
- Modal de sensores
- Control por roles
- Tabla responsive

### 6. MedicionesPage.js
**Ruta:** `/mediciones`

**Características:**
- **3 tipos de gráficas** (línea, barras, área)
- Selector estación/contaminante/período
- **Cards de estadísticas:** promedio, máximo, mínimo, ICA
- Cálculo de Calidad del Aire con colores
- Exportación a CSV
- Recharts responsive

### 7. ReportesPage.js
**Ruta:** `/reportes`

**Características:**
- **5 tipos de reportes:**
  1. General del Sistema
  2. Detallado por Estación
  3. Índice de Calidad del Aire
  4. Análisis de Tendencias
  5. Comparativo de Estaciones
- Filtros dinámicos según tipo
- Formatos: PDF, CSV, JSON
- Historial de reportes generados
- Descarga automática

### 8. Dashboard.js (Público)
**Ruta:** `/`

**Características:**
- Mapa con marcadores de estaciones
- Cards de estadísticas
- Acceso sin autenticación
- Panel de detalles de estación

---

## 🧩 Componentes Reutilizables

### Navbar.js
- React-Bootstrap Navbar
- Integración con AuthContext
- Botón toggle para Sidebar móvil
- Botón de logout
- Responsive

### Sidebar.js
- Nav links con iconos Lucide
- Filtrado por rol
- Offcanvas para móvil
- Estado activo con ThemeContext
- 6 enlaces principales

### MapComponent.js
- React Leaflet
- Marcadores custom
- Popup con info estación
- Badges de ICA
- Props: estaciones, onEstacionClick

---

## 🎯 Rutas Configuradas

```javascript
/                           → Dashboard (público)
/login                      → Login
/register-institution       → RegisterInstitution
/register-station           → RegisterStation
/admin/dashboard            → AdminDashboard (admin_sistema)
/estaciones                 → EstacionesPage
/mediciones                 → MedicionesPage
/reportes                   → ReportesPage (admins)
```

---

## 🔧 Configuración Requerida

### Variables de Entorno

Crear `.env` en `frontend/`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Dependencias Instaladas

```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "bootstrap": "^5.3.3",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.556.0",
    "react": "^19.2.0",
    "react-bootstrap": "^2.10.6",
    "react-dom": "^19.2.0",
    "react-leaflet": "^5.0.0",
    "react-router-dom": "^7.1.1",
    "react-scripts": "^5.0.1",
    "recharts": "^3.5.1"
  }
}
```

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm start

# Build producción
npm run build

# Tests
npm test
```

---

## 📝 Notas de Desarrollo

### Roles del Sistema
- `ciudadano` - Acceso público
- `investigador` - Reportes avanzados
- `admin_estacion` - Gestión de estación
- `admin_institucion` - Gestión de institución
- `admin_sistema` - Gestión completa

### Colores Bootstrap
- `primary` (#0d6efd) - Acciones principales
- `success` (#198754) - Estados positivos
- `danger` (#dc3545) - Alertas/rechazos
- `warning` (#ffc107) - Advertencias
- `info` (#0dcaf0) - Información

### Breakpoints Responsive
- `xs` < 576px
- `sm` ≥ 576px
- `md` ≥ 768px
- `lg` ≥ 992px
- `xl` ≥ 1200px

---

## 👨‍💻 Próximos Pasos

Ver archivo `ESTADO_PROYECTO.md` para roadmap completo.

---

**Desarrollado con Bootstrap 5 + React 19**
