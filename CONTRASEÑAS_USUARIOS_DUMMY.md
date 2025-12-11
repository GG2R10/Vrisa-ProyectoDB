# Contraseñas de Usuarios Dummy - Sistema Vrisa

> **⚠️ IMPORTANTE**: Este documento es solo para desarrollo y testing. **NO usar en producción**.

## Usuarios del Sistema

### 👨‍💼 Administradores del Sistema

| Username | Email | Contraseña | Rol | Descripción |
|----------|-------|------------|-----|-------------|
| `admin` | `admin@vrisa.local` | `admin123` | admin_sistema | Administrador principal del sistema con acceso completo |

---

### 🏛️ Administradores de Institución

| Username | Email | Contraseña | Rol | Institución | Permisos |
|----------|-------|------------|-----|-------------|----------|
| `admin_dagma` | `admin@dagma.gov.co` | `admin123` | admin_institucion | DAGMA | Gestionar estaciones de DAGMA, aprobar/rechazar solicitudes de estación |
| `admin_univalle` | `admin@univalle.edu.co` | `admin123` | admin_estacion | Universidad del Valle | Gestionar estación específica |

---

### 🔬 Investigadores

| Username | Email | Contraseña | Rol | Permisos |
|----------|-------|------------|-----|----------|
| `investigador1` | `investigador@univalle.edu.co` | `Test1234` | investigador | Acceso a datos avanzados, generación de reportes sin restricciones |
| `investigador2` | `investigador2@univalle.edu.co` | `Test1234` | investigador | Acceso a datos avanzados, generación de reportes sin restricciones |
| `investigador3` | `investigador3@univalle.edu.co` | `Test1234` | investigador | Acceso a datos avanzados, generación de reportes sin restricciones |

---

### 👥 Ciudadanos

| Username | Email | Contraseña | Rol | Permisos |
|----------|-------|------------|-----|----------|
| `ciudadano1` | `ciudadano@example.com` | `ciudadano123` | ciudadano | Consulta pública de datos, acceso al mapa |
| `ciudadano2` | `ciudadano2@example.com` | `Test1234` | ciudadano | Consulta pública de datos, acceso al mapa |
| `ciudadano3` | `ciudadano3@example.com` | `Test1234` | ciudadano | Consulta pública de datos, acceso al mapa |
| `testuser` | `testuser@test.com` | `testpass123` | ciudadano | Usuario de prueba general |
| `asustado` | `asustado@asustado.com` | `Test1234` | ciudadano | Usuario de prueba |

---

### 🔧 Técnicos

| Username | Email | Contraseña | Rol | Estación Asignada |
|----------|-------|------------|-----|-------------------|
| `tecnico1` | `tecnico1@example.com` | `Test1234` | tecnico | Asignado a estación específica |

---

### 🏛️ Autoridades Ambientales

| Username | Email | Contraseña | Rol | Permisos |
|----------|-------|------------|-----|----------|
| `autoridad1` | `autoridad1@dagma.gov.co` | `Test1234` | autoridad | Acceso completo a reportes, supervisión de calidad del aire |

---

## Guía Rápida de Testing

### Login con Email o Username
Puedes iniciar sesión usando el **email** o el **username**:
```
Email: admin@vrisa.local
Password: admin123
```
O
```
Username: admin
Password: admin123
```

### Flujos de Prueba Recomendados

#### 1. **Aprobar Institución**
- Login: `admin@vrisa.local` / `admin123`
- Ir a: Panel Admin Sistema → Instituciones Pendientes
- Aprobar una institución pendiente

#### 2. **Solicitar Rol de Investigador**
- Login: `ciudadano2@example.com` / `Test1234`
- Solicitar cambio a investigador
- Logout y login como: `admin@vrisa.local` / `admin123`
- Aprobar solicitud en: Panel Admin Sistema → Solicitudes de Investigador

#### 3. **Crear y Aprobar Estación**
- Login: `ciudadano1@example.com` / `ciudadano123`
- Crear solicitud de estación
- Logout y login como: `admin_dagma@dagma.gov.co` / `admin123`
- Aprobar estación en: Panel Admin Institución → Estaciones Pendientes

#### 4. **Generar Reportes**
- **Investigador**: `investigador1@univalle.edu.co` / `Test1234` → Puede generar reportes de cualquier estación
- **Admin Institución**: `admin_dagma@dagma.gov.co` / `admin123` → Solo reportes de estaciones de DAGMA
- **Ciudadano**: `ciudadano1@example.com` / `ciudadano123` → Sin acceso a reportes

---

## Notas de Seguridad

- 🔒 Todas las contraseñas están hasheadas en la base de datos usando el sistema de Django
- 🚫 **NUNCA** uses estas contraseñas en un entorno de producción
- 🔄 Cambia todas las contraseñas antes de desplegar a producción
- 📝 Este documento debe estar en `.gitignore` en producción

---

## Resetear Base de Datos

Si necesitas resetear la base de datos y recrear los usuarios:

```bash
# Detener y eliminar contenedor de PostgreSQL
docker-compose down -v

# Iniciar PostgreSQL nuevamente
docker-compose up -d

# Aplicar migraciones
cd backend
python manage.py migrate

# Ejecutar script de seeds
python crear_seeds.py
```

---

**Última actualización**: 2025-12-10
