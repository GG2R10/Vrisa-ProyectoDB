# Guía de Endpoints API - VriSA

## 🔐 Autenticación

### POST /api/token/
**Descripción**: Login de usuario
```
Body:
{
  "username": "usuario",
  "password": "contraseña"
}

Response:
{
  "access": "token_jwt",
  "refresh": "refresh_token",
  "user": { ... }
}
```

### POST /api/token/refresh/
**Descripción**: Refrescar token de acceso
```
Body:
{
  "refresh": "refresh_token"
}

Response:
{
  "access": "nuevo_token_jwt"
}
```

---

## 👤 Usuarios

### GET /usuarios/me/
**Descripción**: Obtener datos del usuario autenticado
**Permisos**: Autenticado
**Response**: Información completa del usuario incluyendo rol institucional

### POST /usuarios/
**Descripción**: Registrar nuevo usuario (ciudadano)
```
Body:
{
  "username": "usuario",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "segura123",
  "solicita_investigador": false,
  "solicita_autoridad": false
}
```

### GET /usuarios/
**Descripción**: Listar todos los usuarios
**Permisos**: Solo Admin Sistema

### GET /usuarios/{id}/
**Descripción**: Obtener datos de un usuario específico

### PUT /usuarios/{id}/
**Descripción**: Actualizar usuario

### DELETE /usuarios/{id}/
**Descripción**: Eliminar usuario

---

## 📋 Solicitudes de Investigador

### POST /solicitudes/investigador/crear/
**Descripción**: Crear solicitud de investigador
**Permisos**: Ciudadano
```
Response:
{
  "id": 1,
  "usuario": 5,
  "usuario_nombre": "Juan",
  "usuario_apellido": "Pérez",
  "usuario_email": "juan@example.com",
  "estado": "pendiente",
  "fecha_solicitud": "2024-12-08T10:30:00Z"
}
```

### GET /solicitudes/investigador/?estado=pendiente
**Descripción**: Listar solicitudes de investigador
**Permisos**: Admin Sistema
**Query Params**: 
- estado: 'pendiente', 'aprobada', 'rechazada'

### POST /solicitudes/investigador/{id}/aprobar/
**Descripción**: Aprobar solicitud de investigador
**Permisos**: Admin Sistema
**Acción**: Cambiar tipo de usuario a 'investigador'

### POST /solicitudes/investigador/{id}/rechazar/
**Descripción**: Rechazar solicitud de investigador
**Permisos**: Admin Sistema
**Acción**: Cambiar solicita_investigador a False

---

## 🏛️ Solicitudes de Autoridad Ambiental

### POST /solicitudes/autoridad/crear/
**Descripción**: Crear solicitud de autoridad
**Permisos**: Ciudadano
```
Response:
{
  "id": 1,
  "usuario": 5,
  "usuario_nombre": "Juan",
  "usuario_apellido": "Pérez",
  "usuario_email": "juan@example.com",
  "estado": "pendiente",
  "fecha_solicitud": "2024-12-08T10:30:00Z"
}
```

### GET /solicitudes/autoridad/?estado=pendiente
**Descripción**: Listar solicitudes de autoridad
**Permisos**: Admin Sistema

### POST /solicitudes/autoridad/{id}/aprobar/
**Descripción**: Aprobar solicitud de autoridad
**Permisos**: Admin Sistema
**Acción**: Cambiar tipo de usuario a 'autoridad'

### POST /solicitudes/autoridad/{id}/rechazar/
**Descripción**: Rechazar solicitud de autoridad
**Permisos**: Admin Sistema

---

## 🏢 Instituciones

### GET /instituciones/
**Descripción**: Listar instituciones (solo aprobadas para usuarios normales)
**Filtros**:
- Admin Sistema: ve todas
- Admin Institución: ve su institución
- Otros: ven solo aprobadas

### POST /instituciones/
**Descripción**: Crear nueva institución (solicitud)
**Permisos**: Ciudadano
```
Body:
{
  "nombre": "Instituto de Calidad del Aire",
  "direccion": "Calle 10 #50-20",
  "color_primario": "#2563eb",
  "color_secundario": "#64748b"
}

Response:
{
  "id": 1,
  "nombre": "Instituto de Calidad del Aire",
  "creador": 5,
  "direccion": "Calle 10 #50-20",
  "color_primario": "#2563eb",
  "color_secundario": "#64748b",
  "estado_validacion": "pendiente",
  "fecha_creacion": "2024-12-08T10:30:00Z"
}
```

### GET /instituciones/{id}/
**Descripción**: Obtener detalles de institución

### PUT /instituciones/{id}/
**Descripción**: Actualizar institución
**Permisos**: Admin de la institución

### DELETE /instituciones/{id}/
**Descripción**: Eliminar institución

### GET /instituciones/sistema/pendientes/
**Descripción**: Listar instituciones pendientes de aprobación
**Permisos**: Admin Sistema

### POST /instituciones/{id}/aprobar/
**Descripción**: Aprobar institución
**Permisos**: Admin Sistema
**Acción**: 
- Cambiar estado a 'aprobada'
- Asignar creador como admin_institucion
- Cambiar tipo de usuario creador a 'admin_institucion'

### POST /instituciones/{id}/rechazar/
**Descripción**: Rechazar institución
**Permisos**: Admin Sistema
**Acción**: Eliminar la solicitud

---

## 🛰️ Estaciones

### GET /estaciones/
**Descripción**: Listar estaciones
**Filtros**: Según rol del usuario

### POST /estaciones/
**Descripción**: Crear nueva estación (solicitud)
**Permisos**: Ciudadano
```
Body:
{
  "nombre": "Estación Centro",
  "direccion": "Avenida Pasoancho",
  "ubicacion_latitud": 3.4372,
  "ubicacion_longitud": -76.5225,
  "ubicacion_referencia": "Parque San Antonio",
  "institucion": 1,
  "tecnico": 10
}
```

### GET /estaciones/{id}/
**Descripción**: Obtener detalles de estación

### PUT /estaciones/{id}/
**Descripción**: Actualizar estación

### DELETE /estaciones/{id}/
**Descripción**: Eliminar estación

### GET /estaciones/pendientes/
**Descripción**: Listar estaciones pendientes de su institución
**Permisos**: Admin Institución

### GET /estaciones/sistema/todas/
**Descripción**: Listar todas las estaciones
**Permisos**: Admin Sistema

### PUT /estaciones/{id}/modificar/
**Descripción**: Modificar estación
**Permisos**: Admin Sistema o Admin de la institución

### POST /estaciones/{id}/eliminar/
**Descripción**: Eliminar estación
**Permisos**: Admin Sistema

### POST /estaciones/{id}/aprobar/
**Descripción**: Aprobar solicitud de estación
**Permisos**: Admin Institución
**Acción**:
- Cambiar estado a 'aprobada'
- Asignar técnico con tipo 'tecnico'
- Asignar creador como admin_estacion
- Cambiar tipo de usuario creador a 'admin_estacion'

### POST /estaciones/{id}/rechazar/
**Descripción**: Rechazar solicitud de estación
**Permisos**: Admin Institución
**Acción**: Eliminar la solicitud

---

## 📊 Reportes

### GET /reportes/estaciones_disponibles/
**Descripción**: Listar estaciones disponibles según rol
**Response**: Array de estaciones que el usuario puede usar en reportes

### GET /reportes/general/
**Descripción**: Obtener reporte general de calidad del aire
**Permisos**: Todos (ciudadano)
**Query Params**:
- tipo_reporte: 'calidad_aire', 'tendencias', 'alertas', 'infraestructura'
- fecha_inicio: 'YYYY-MM-DD'
- fecha_fin: 'YYYY-MM-DD'

### POST /reportes/detallado/
**Descripción**: Obtener reporte detallado
**Permisos**: Según jerarquía
```
Body:
{
  "estaciones": [1, 2, 3],
  "tipo_reporte": "calidad_aire",
  "fecha_inicio": "2024-12-01",
  "fecha_fin": "2024-12-08"
}
```

---

## 🚨 Alertas

### GET /alertas/
**Descripción**: Listar alertas
**Filtros**: Según rol:
- Admin Sistema: ve todas
- Admin Institución: ve alertas de sus estaciones
- Admin Estación/Técnico: ve alertas de su estación
- Ciudadano: no tiene acceso

### POST /alertas/
**Descripción**: Crear alerta (automático desde mediciones)

### GET /alertas/{id}/
**Descripción**: Obtener detalles de alerta

### PUT /alertas/{id}/
**Descripción**: Actualizar alerta

### DELETE /alertas/{id}/
**Descripción**: Eliminar alerta

---

## 🔬 Sensores

### GET /sensores/
**Descripción**: Listar sensores

### POST /sensores/
**Descripción**: Crear sensor
**Permisos**: Admin de la estación

### GET /sensores/{id}/
**Descripción**: Obtener detalles de sensor

---

## 📈 Mediciones

### GET /mediciones/
**Descripción**: Listar mediciones

### POST /mediciones/
**Descripción**: Crear medición
**Permisos**: Técnico o sistema automático

### GET /mediciones/{id}/
**Descripción**: Obtener detalles de medición

---

## 🔄 Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

---

## 📝 Errores Comunes

### No autenticado
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Sin permisos
```json
{
  "detail": "No eres administrador de ninguna institución."
}
```

### Validación fallida
```json
{
  "field_name": ["Error message"]
}
```

---

## 🧪 Ejemplos de Uso (cURL)

### Registrar usuario
```bash
curl -X POST http://localhost:8000/usuarios/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "segura123",
    "solicita_investigador": false,
    "solicita_autoridad": false
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "password": "segura123"
  }'
```

### Solicitar ser investigador
```bash
curl -X POST http://localhost:8000/solicitudes/investigador/crear/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}"
```

### Crear institución
```bash
curl -X POST http://localhost:8000/instituciones/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nombre": "Instituto de Calidad",
    "direccion": "Calle 10 #50",
    "color_primario": "#2563eb",
    "color_secundario": "#64748b"
  }'
```

---

**Última actualización**: Diciembre 8, 2025
