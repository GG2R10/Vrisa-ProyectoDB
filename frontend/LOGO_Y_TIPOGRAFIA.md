# VriSA - Logo y Tipografía

## 📋 Documentación de Identidad Visual

Este documento describe la implementación del logo y sistema tipográfico de VriSA.

---

## 🎨 Logo VriSA

### Componente: `VriSALogo.js`

**Ubicación:** `frontend/src/components/VriSALogo.js`

#### Características del Logo

1. **Diseño SVG responsivo** con icono de nube estilizada y símbolo de monitoreo
2. **Gradiente verde** (#11998e → #38ef7d) representando aire limpio y naturaleza
3. **Tipografía Poppins** en el texto "VriSA" con peso 700 (bold)

#### Props del Componente

```javascript
<VriSALogo 
    size="md"         // Tamaño: 'sm', 'md', 'lg', 'xl'
    variant="full"    // Variante: 'full', 'icon', 'text'
    color="default"   // Color: 'default', 'white', 'dark'
/>
```

#### Tamaños Disponibles

| Size | Width | Font Size | Icon Size | Uso Recomendado |
|------|-------|-----------|-----------|-----------------|
| `sm` | 100px | 1.5rem    | 24px      | Navbar, headers pequeños |
| `md` | 140px | 2rem      | 32px      | Sidebar, cards |
| `lg` | 180px | 2.5rem    | 40px      | Login, páginas de registro |
| `xl` | 220px | 3rem      | 48px      | Landing pages, hero sections |

#### Variantes

- **`full`**: Icono + texto (por defecto) - Uso principal en navegación
- **`icon`**: Solo icono - Para espacios reducidos o favicons
- **`text`**: Solo texto - Para contextos donde el icono no es necesario

#### Colores

- **`default`**: Gradiente verde (#11998e → #38ef7d) - Uso estándar
- **`white`**: Blanco/gris claro - Para fondos oscuros
- **`dark`**: Azul (#0d6efd → #0dcaf0) - Para contextos específicos

---

## 📝 Sistema Tipográfico

### Fuente Principal: **Poppins**

**Importación en `index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
```

### Variables CSS

```css
:root {
  --font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

### Jerarquía Tipográfica

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| `h1` | 2.5rem (40px) | 800 (extrabold) | Títulos principales de páginas |
| `h2` | 2rem (32px) | 700 (bold) | Subtítulos principales |
| `h3` | 1.75rem (28px) | 600 (semibold) | Secciones importantes |
| `h4` | 1.5rem (24px) | 600 (semibold) | Subtítulos de secciones |
| `h5` | 1.25rem (20px) | 500 (medium) | Títulos de cards/componentes |
| `h6` | 1rem (16px) | 500 (medium) | Títulos menores |
| `p, span, div` | 1rem (16px) | 400 (regular) | Texto general |

### Clases Utilitarias de Peso

```html
<p className="fw-light">Texto ligero (300)</p>
<p className="fw-regular">Texto regular (400)</p>
<p className="fw-medium">Texto medio (500)</p>
<p className="fw-semibold">Texto semi-bold (600)</p>
<p className="fw-bold">Texto bold (700)</p>
<p className="fw-extrabold">Texto extra-bold (800)</p>
```

### Características Tipográficas

- **Letter Spacing:** -0.02em para h1-h6 (espaciado negativo para mejor legibilidad)
- **Font Smoothing:** Antialiasing activado para renderizado suave
- **Line Height:** 1.5 para texto general (heredado de Bootstrap)

---

## 🎨 Paleta de Colores VriSA

### Colores Primarios

```css
:root {
  --primary-color: #11998e;      /* Verde azulado */
  --secondary-color: #38ef7d;    /* Verde brillante */
  --gradient-primary: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
```

### Uso de Colores

- **Primario (#11998e):** Botones principales, enlaces, iconos importantes
- **Secundario (#38ef7d):** Acentos, hover states, highlights
- **Gradiente:** Logo, headers importantes, elementos destacados

---

## 📦 Implementación en Componentes

### 1. **Navbar** (`components/Navbar.js`)
```jsx
import VriSALogo from './VriSALogo';

<BSNavbar.Brand as={Link} to="/">
    <VriSALogo size="sm" variant="full" />
</BSNavbar.Brand>
```

### 2. **Login** (`pages/auth/Login.js`)
```jsx
<div className="text-center mb-4">
    <div className="mb-3">
        <VriSALogo size="lg" variant="full" />
    </div>
    <h2 className="fw-bold mb-2">Bienvenido</h2>
</div>
```

### 3. **RegisterInstitution** (`pages/auth/RegisterInstitution.js`)
```jsx
<div className="text-center mb-4">
    <div className="mb-3">
        <VriSALogo size="lg" variant="full" />
    </div>
    <h2 className="fw-bold mb-2">Registro de Institución</h2>
</div>
```

### 4. **RegisterStation** (`pages/auth/RegisterStation.js`)
```jsx
<div className="text-center mb-4">
    <div className="mb-3">
        <VriSALogo size="lg" variant="full" />
    </div>
    <h2 className="fw-bold mb-2">Registro de Estación de Monitoreo</h2>
</div>
```

---

## 🔧 Personalización del Logo

### Cambiar Colores del Gradiente

Edita el archivo `VriSALogo.js`:

```javascript
const colors = {
    default: { 
        primary: '#11998e',    // Color inicial del gradiente
        secondary: '#38ef7d',  // Color final del gradiente
        text: '#1a1a1a'        // Color de texto (no se usa con gradiente)
    }
};
```

### Modificar el Icono SVG

El icono está compuesto de:
1. **Forma de nube** con gradiente y opacidad
2. **Ondas de aire/viento** (2 líneas curvas)
3. **Círculo central** representando monitoreo

```jsx
{/* Círculo central (monitoreo) */}
<circle cx="24" cy="18" r="6" fill={currentColors.primary} />
<circle cx="24" cy="18" r="3" fill="white" />
```

---

## 📱 Responsive Design

El logo se adapta automáticamente a diferentes tamaños de pantalla:

### Mobile
```jsx
<VriSALogo size="sm" variant="full" />  // Navbar
```

### Tablet/Desktop
```jsx
<VriSALogo size="md" variant="full" />  // Sidebar, Cards
```

### Login/Landing Pages
```jsx
<VriSALogo size="lg" variant="full" />  // Páginas de autenticación
```

---

## ✅ Buenas Prácticas

### 1. **Consistencia**
- Usa siempre el componente `VriSALogo` en lugar de texto plano "VriSA"
- Mantén los tamaños consistentes según el contexto (sm para navbar, lg para auth)

### 2. **Accesibilidad**
- El SVG incluye atributos `fill` y `stroke` con colores contrastantes
- Considera agregar `aria-label` cuando uses solo el icono

### 3. **Performance**
- SVG en línea (no archivos externos) para carga instantánea
- Fuente Poppins cargada con `display=swap` para evitar FOIT

### 4. **Mantenimiento**
- Todos los colores están centralizados en variables CSS
- Cambios en gradiente solo requieren editar `VriSALogo.js`

---

## 🚀 Próximos Pasos

### Recomendaciones de Mejora

1. **Favicon** - Exportar versión icon-only del logo como favicon
2. **Open Graph Image** - Crear imagen social con logo para compartir
3. **Loading Animation** - Animar el logo durante cargas
4. **Dark Mode** - Preparar variante del logo para modo oscuro
5. **SVG Optimization** - Reducir tamaño del SVG si es necesario

### Archivos Relacionados

```
frontend/
  src/
    components/
      VriSALogo.js          ← Componente del logo
      Navbar.js             ← Usa el logo
    pages/
      auth/
        Login.js            ← Usa el logo
        RegisterInstitution.js ← Usa el logo
        RegisterStation.js  ← Usa el logo
    index.css               ← Tipografía Poppins
```

---

## 📞 Soporte

Para cambios en la identidad visual, edita:
- **Logo:** `frontend/src/components/VriSALogo.js`
- **Tipografía:** `frontend/src/index.css`
- **Colores:** Variables CSS en `:root` de `index.css`

---

**Última actualización:** 2025
**Versión:** 1.0
**Desarrollado para:** VriSA - Sistema de Monitoreo de Calidad del Aire de Cali
