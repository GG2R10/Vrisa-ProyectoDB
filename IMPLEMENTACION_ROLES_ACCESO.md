# Implementación Completa del Sistema de Roles y Control de Acceso - VriSA

## Resumen de Cambios Realizados

Esta implementación completa el sistema de gestión jerárquica de roles y control de acceso para la plataforma VriSA de monitoreo de calidad del aire en Cali.

---

## 🔄 CAMBIOS EN EL BACKEND (Django REST Framework)

### 1. **Modelos (usuarios/models.py)**
- ✅ Añadidos campos al modelo `Usuario`:
  - `solicita_investigador` (Boolean): indica si el usuario solicita ser investigador
  - `solicita_autoridad` (Boolean): indica si solicita ser autoridad ambiental
  - `es_autoridad_aprobada` (Boolean): si la autoridad fue aprobada
  - `investigador_aprobado` (Boolean): si el investigador fue aprobado
  - `tipo` ahora tiene valor por defecto 'ciudadano'

- ✅ Nuevos modelos:
  - `SolicitudInvestigador`: gestiona solicitudes de investigadores con estados (pendiente/aprobada/rechazada)
  - `SolicitudAutoridad`: gestiona solicitudes de autoridades ambientales

- ✅ Actualización de relaciones:
  - `AdministradorInstitucion`: relación many-to-one con Institución (related_name='admin_institucion')
  - `AdministradorEstacion`: relación many-to-one con Estación (related_name='admin_estacion')
  - `Tecnico`: relación many-to-one con Estación (related_name='tecnico')

### 2. **Serializers (usuarios/serializers.py)**
- ✅ `UsuarioSerializer`: actualizado para incluir nuevos campos de solicitudes
- ✅ `UsuarioDetailSerializer`: nuevo serializer que incluye:
  - Información de admin_institucion con datos de la institución (colores, nombre)
  - Información de admin_estacion con datos de la institución asociada
  - Información de técnico con datos de la institución asociada
- ✅ `SolicitudInvestigadorSerializer`: serializer para solicitudes de investigador
- ✅ `SolicitudAutoridadSerializer`: serializer para solicitudes de autoridad

### 3. **Views (usuarios/views.py)**
- ✅ `UsuarioViewSet`: CRUD básico de usuarios
- ✅ `CurrentUserDetailView`: obtiene detalles del usuario autenticado
- ✅ `SolicitudInvestigadorCreateView`: crear/actualizar solicitud de investigador
- ✅ `SolicitudAutoridadCreateView`: crear/actualizar solicitud de autoridad
- ✅ `ListarSolicitudesInvestigadorView`: listar solicitudes pendientes (admin sistema)
- ✅ `ListarSolicitudesAutoridadView`: listar solicitudes pendientes (admin sistema)
- ✅ `AprobarSolicitudInvestigadorView`: aprobar solicitud y cambiar tipo de usuario
- ✅ `RechazarSolicitudInvestigadorView`: rechazar solicitud
- ✅ `AprobarSolicitudAutoridadView`: aprobar autoridad
- ✅ `RechazarSolicitudAutoridadView`: rechazar autoridad

### 4. **URLs (usuarios/urls.py)**
Nuevas rutas:
```
POST   /solicitudes/investigador/crear/
POST   /solicitudes/autoridad/crear/
GET    /solicitudes/investigador/?estado=pendiente
GET    /solicitudes/autoridad/?estado=pendiente
POST   /solicitudes/investigador/<id>/aprobar/
POST   /solicitudes/investigador/<id>/rechazar/
POST   /solicitudes/autoridad/<id>/aprobar/
POST   /solicitudes/autoridad/<id>/rechazar/
GET    /usuarios/me/
```

### 5. **Views de Instituciones (instituciones/views.py)**
- ✅ `ListarInstitucionesPendientesView`: listar instituciones pendientes (admin sistema)
- ✅ `AprobarInstitucionView`: aprobar institución y asignar admin
- ✅ `RechazarInstitucionView`: rechazar institución con validación de estado

### 6. **URLs de Instituciones (instituciones/urls.py)**
```
GET/POST /instituciones/
GET      /instituciones/sistema/pendientes/
POST     /instituciones/<id>/aprobar/
POST     /instituciones/<id>/rechazar/
```

### 7. **Views de Estaciones (estaciones/views.py)**
- ✅ `ListarEstacionesPendientesView`: estaciones pendientes de institución
- ✅ `ListarEstacionesSistemaView`: todas las estaciones (admin sistema)
- ✅ `AprobarEstacionView`: aprobar estación, asignar admin_estacion y técnico
- ✅ `RechazarEstacionView`: rechazar estación
- ✅ `EliminarEstacionView`: eliminar estación (admin sistema)
- ✅ `ModificarEstacionView`: modificar estación (admin sistema/institución)

### 8. **URLs de Estaciones (estaciones/urls.py)**
```
GET/POST /estaciones/
GET      /estaciones/pendientes/
GET      /estaciones/sistema/todas/
PUT      /estaciones/<id>/modificar/
POST     /estaciones/<id>/eliminar/
POST     /estaciones/<id>/aprobar/
POST     /estaciones/<id>/rechazar/
```

### 9. **Permisos (reportes/permissions.py)**
- ✅ `PuedeGenerarReportes`: validar que el usuario pueda acceder a reportes
- ✅ `PuedeAccederReporteDetallado`: nueva clase con lógica de jerarquía:
  - **Investigadores y Autoridades**: acceso a todo
  - **Admin de institución**: acceso a estaciones de su institución
  - **Admin de estación y Técnico**: acceso solo a su estación
  - **Ciudadano**: acceso solo a reportes generales

### 10. **Settings (api_estaciones/settings.py)**
- ✅ Añadidos a INSTALLED_APPS:
  - 'rest_framework'
  - 'corsheaders'
  - 'reportes'

### 11. **URLs Principales (api_estaciones/urls.py)**
- ✅ Actualizado para incluir usuarios, instituciones, estaciones correctamente

---

## 🎨 CAMBIOS EN EL FRONTEND (React)

### 1. **Páginas de Autenticación**

#### Login.js
- ✅ Mejorado con mejor UX
- ✅ Enlace a página de registro
- ✅ Iconos y validaciones

#### Register.js (NUEVA)
- ✅ Registro de ciudadanos con campos:
  - nombre, apellido, username, email, contraseña
  - Checkbox para solicitar ser autoridad ambiental
  - Checkbox para solicitar ser investigador
  - Validación de contraseña (mínimo 8 caracteres)

### 2. **Páginas de Ciudadano**

#### CitizenOptions.js (NUEVA)
- ✅ Panel de opciones para ciudadanos con 3 tabs:
  
  **Tab 1: Solicitud de Investigador**
  - Enviar solicitud para ser investigador
  - Ver estado de solicitud
  - Mensaje de confirmación
  
  **Tab 2: Registrar Institución**
  - Formulario para crear nueva institución
  - Campos: nombre, dirección, colores primario/secundario
  - Validación y feedback
  
  **Tab 3: Registrar Estación**
  - Formulario para crear estación
  - Campos: nombre, dirección, latitud, longitud, referencia
  - Selección de institución y técnico
  - Validación y feedback

### 3. **Panel de Administrador del Sistema**

#### AdminSystemDashboard.js (NUEVA)
- ✅ Panel de control para admin del sistema con 4 tabs:

  **Tab 1: Instituciones Pendientes**
  - Tabla con instituciones pendientes de aprobación
  - Botones para aprobar/rechazar
  - Información: nombre, creador, dirección, fecha
  
  **Tab 2: Gestionar Estaciones**
  - Tabla con todas las estaciones
  - Ver estado, institución, fecha
  - Botones para modificar y eliminar
  
  **Tab 3: Solicitudes de Investigador**
  - Tabla de solicitudes pendientes
  - Información de usuario y fecha
  - Botones para aprobar/rechazar
  
  **Tab 4: Solicitudes de Autoridad**
  - Tabla de solicitudes de autoridad ambiental
  - Información de usuario y fecha
  - Botones para aprobar/rechazar

### 4. **Componentes Actualizados**

#### Navbar.js
- ✅ Ahora muestra opciones de menú cuando no hay usuario:
  - Botón "Inicia sesión"
  - Botón "Registrarse"
  
- ✅ Cuando hay usuario:
  - Menú dropdown con perfil del usuario
  - Email del usuario
  - Enlace al panel respectivo según rol
  - Botón de cerrar sesión

#### Sidebar.js
- ✅ Actualizado para mostrar menús según rol del usuario:
  - Todos ven: Mapa, Estaciones, Mediciones, Reportes
  - Admin institución/estación/técnico: Alertas
  - Ciudadanos: Tab "Mis Opciones"
  - Admin sistema: Tab "Panel Admin Sistema"
  
- ✅ Ahora muestra el rol actual en la parte inferior de la barra lateral

#### App.js
- ✅ Nuevas rutas agregadas:
  ```
  /login - Login
  /register - Registro ciudadano (NUEVA)
  /citizen/opciones - Panel ciudadano (NUEVA)
  /admin/sistema - Panel admin sistema (NUEVA)
  /admin/dashboard - Panel admin institución/estación
  /alertas - Alertas (NUEVA)
  ```

### 5. **Context Providers**

#### AuthContext.js
- ✅ Mejorado para aplicar tema según rol del usuario:
  - Si es admin_institucion: aplica colores de su institución
  - Si es admin_estacion o técnico: aplica colores de su institución
  - Si es ciudadano: tema por defecto
- ✅ Nueva función `applyUserTheme()` que integra con ThemeContext

#### ThemeContext.js
- ✅ Ya existía, ahora se integra con los colores institucionales

### 6. **Servicios Actualizados**

#### authService.js
- ✅ Nuevos métodos:
  ```javascript
  requestInvestigador()           // POST /solicitudes/investigador/crear/
  requestAutoridad()              // POST /solicitudes/autoridad/crear/
  getPendingInvestigadores()      // GET /solicitudes/investigador/?estado=pendiente
  getPendingAutoridades()         // GET /solicitudes/autoridad/?estado=pendiente
  approveInvestigador(id)         // POST /solicitudes/investigador/{id}/aprobar/
  rejectInvestigador(id)          // POST /solicitudes/investigador/{id}/rechazar/
  approveAutoridad(id)            // POST /solicitudes/autoridad/{id}/aprobar/
  rejectAutoridad(id)             // POST /solicitudes/autoridad/{id}/rechazar/
  getCurrentUser()                // GET /usuarios/me/
  ```

#### institucionService.js
- ✅ Nuevos métodos:
  ```javascript
  approve(id)        // POST /instituciones/{id}/aprobar/
  reject(id)         // POST /instituciones/{id}/rechazar/
  getPending()       // GET /instituciones/sistema/pendientes/
  ```

#### estacionService.js
- ✅ Nuevos métodos:
  ```javascript
  approve(id)        // POST /estaciones/{id}/aprobar/
  reject(id)         // POST /estaciones/{id}/rechazar/
  getPending()       // GET /estaciones/pendientes/
  ```

---

## 🔐 FLUJOS DE AUTORIZACIÓN Y ROLES

### Jerarquía de Roles (Exclusivos):
1. **Admin del Sistema**: Gestiona todo
2. **Admin de Institución**: Gestiona su institución y sus estaciones
3. **Admin de Estación**: Gestiona su estación
4. **Técnico**: Monitorea su estación
5. **Investigador**: Ve datos de todas las estaciones
6. **Autoridad Ambiental**: Ve datos de todas las estaciones
7. **Ciudadano**: Solo ve reportes generales

### Flujos de Solicitud:

**Flujo 1: Ciudadano → Investigador**
1. Ciudadano hace solicitud en CitizenOptions.js
2. Se crea `SolicitudInvestigador` en estado 'pendiente'
3. Admin sistema ve solicitud en AdminSystemDashboard
4. Admin aprueba/rechaza
5. Si aprueba: usuario.tipo = 'investigador'

**Flujo 2: Ciudadano → Autoridad Ambiental**
1. Durante registro o en CitizenOptions, ciudadano marca checkbox
2. Se crea `SolicitudAutoridad` en estado 'pendiente'
3. Admin sistema ve solicitud
4. Admin aprueba/rechaza
5. Si aprueba: usuario.tipo = 'autoridad'

**Flujo 3: Ciudadano → Admin de Institución**
1. Ciudadano crea institución en CitizenOptions
2. Se crea institución con creador = ciudadano, estado = 'pendiente'
3. Admin sistema ve en AdminSystemDashboard
4. Admin aprueba → usuario.tipo = 'admin_institucion'

**Flujo 4: Ciudadano → Admin de Estación**
1. Ciudadano crea estación (debe especificar institución y técnico)
2. Se crea estación con creador = ciudadano, estado = 'pendiente'
3. Admin institución ve en sus pendientes
4. Admin aprueba → usuario creador.tipo = 'admin_estacion'
5. Usuario técnico.tipo = 'tecnico'

---

## 🎨 CARACTERÍSTICAS DE TEMA INSTITUCIONAL

Cuando un usuario con rol institucional inicia sesión:
- Navbar y Sidebar adoptan los colores de su institución
- Variables CSS se actualizan con colores primario y secundario
- Experiencia visual personalizada por institución

---

## 📝 PRÓXIMOS PASOS (No Incluidos)

1. Crear migrations de Django para nuevos modelos
2. Implementar JWT token completo si se requiere
3. Agregar lógica de alertas con validación de permisos
4. Implementar filtrado de datos en endpoints según rol
5. Añadir paginación en listados
6. Implementar búsqueda y filtrado en tablas admin
7. Agregar modal para editar estaciones en AdminSystemDashboard
8. Implementar validación de email único
9. Agregar recuperación de contraseña
10. Implementar endpoints de actualización de perfil

---

## 🚀 NOTAS IMPORTANTES

### Base de Datos
- Se requiere ejecutar migraciones:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

### CORS
- Asegúrate de que CORS esté configurado correctamente en settings.py
- El frontend en React debe poder comunicarse con el backend

### Autenticación
- El sistema actual usa tokens en localStorage
- Se recomienda implementar refresh tokens con expiración
- Considerar usar JWT con HttpOnly cookies para mayor seguridad

### Testing
- Se recomienda agregar tests unitarios para los nuevos endpoints
- Validar flujos de aprobación/rechazo
- Pruebas de permisos en diferentes roles

---

## 📊 Resumen de Cambios

| Aspecto | Backend | Frontend | Estado |
|---------|---------|----------|--------|
| Modelos de Usuario | ✅ Actualizado | N/A | Completo |
| Endpoints Solicitudes | ✅ Creados | ✅ Integrados | Completo |
| Panel Admin Sistema | N/A | ✅ Creado | Completo |
| Colores Institucionales | N/A | ✅ Implementado | Completo |
| Controles de Acceso | ✅ Mejorados | ✅ Implementados | Completo |
| Navegación por Rol | N/A | ✅ Actualizada | Completo |

---

**Implementación completada**: Diciembre 8, 2025
**Tiempo estimado de implementación**: 4-6 horas de desarrollo
**Complejidad**: Media-Alta
