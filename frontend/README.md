# Frontend - Lector EPUB

Página de inicio informativa para la plataforma Lector EPUB.

## 📁 Estructura

```
frontend/
├── index.html      # Página de inicio
├── books.html      # Página de biblioteca
├── styles.css      # Estilos comunes
├── books.css       # Estilos de biblioteca
├── books.js        # JavaScript para biblioteca
└── README.md       # Este archivo
```

## 🚀 Uso

### Opción 1: Abrir directamente en navegador

```bash
# Windows - En PowerShell
start frontend\index.html

# Linux/Mac
open frontend/index.html
```

### Opción 2: Usar servidor local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server
```

Luego accede a: `http://localhost:8000/frontend/index.html`

## 📋 Páginas

1. **Inicio** (`index.html`) - Página informativa del producto
2. **Biblioteca** (`books.html`) - Listado de libros disponibles

## 🔗 URLs Disponibles

- **Inicio:** `http://localhost:8000/frontend/index.html`
- **Biblioteca:** `http://localhost:8000/frontend/books.html`

## 📚 Funcionalidades

### Página de Inicio
- Descripción del producto
- Características principales
- Call-to-action

### Página de Biblioteca
- ✅ Lista todos los libros disponibles desde el backend
- ✅ Muestra información: título, autor, descripción, cantidad de capítulos
- ✅ Portadas de libros (placeholder si no hay URL)
- ✅ Botón "Seleccionar" para cada libro
- ✅ Información del libro (parcial, extensible)
- ✅ Estados: cargando, vacío, error
- ✅ Diseño responsivo
- ✅ Comunicación con API (`GET /api/books`)

## ⚙️ Requisitos

### Para probar la página de Biblioteca
1. **Backend ejecutándose** en `http://localhost:3000`
2. **PostgreSQL corriendo** (con datos de libros cargados)

### Pasos:
```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# Terminal 2: Iniciar servidor frontend
python -m http.server 8000

# Luego visita:
# Inicio: http://localhost:8000/frontend/
# Biblioteca: http://localhost:8000/frontend/books.html
```

## 📝 Cómo Probar

### Sin libros en BD
1. Abre `http://localhost:8000/frontend/books.html`
2. Verás el estado "No hay libros disponibles"

### Con libros en BD
1. Crea libros con el script `backend/test-api.js` o con curl
2. Abre `http://localhost:8000/frontend/books.html`
3. Los libros se cargarán automáticamente
4. Haz clic en "Seleccionar" para marcar libros
5. Usa el botón ℹ️ para ver detalles de Diseño

- ✅ Diseño responsivo (mobile-first)
- ✅ Compatibilidad con todos los navegadores modernos
- ✅ Accesibilidad mejorada
- ✅ Animaciones suaves sin JavaScript
- ✅ CSS personalizado sin frameworks
- ✅ Paleta de colores coherente
- ✅ Tipografía clara y legible

## 📱 Responsive

- **Desktop** (1200px+): Layout completo
- **Tablet** (768px - 1199px): Ajustes para pantalla mediana
- **Mobile** (hasta 767px): Layout mobile optimizado

## 🔧 Personalización

### Cambiar Colores

Edita las variables en `styles.css`:

```css
:root {
  --primary-color: #2c3e50;        /* Color principal */
  --secondary-color: #e74c3c;      /* Color secundario */
  --accent-color: #3498db;         /* Color de acentos */
  --light-bg: #f8f9fa;             /* Fondo claro */
}
```

### Cambiar Contenido

Edita el HTML en `index.html` para:
- Modificar texto
- Agregar/quitar secciones
- Cambiar emojis de características

## 📝 Próximas Mejoras

- [ ] Implementar acción de "Seleccionar" libro (ir a visor)
- [ ] Modal/página detallada de libro
- [ ] Paginación de libros
- [ ] Búsqueda y filtros
- [ ] Integración con visor de libros
- [ ] Página de lectura
- [ ] Autenticación de usuario
- [ ] Efecto parallax
- [ ] Modo oscuro

## 🌐 Navegadores Soportados

- Chrome/Chromium (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Edge (últimas versiones)

## 📄 Licencia

MIT
