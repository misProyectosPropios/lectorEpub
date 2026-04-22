# lectorEpub

Una plataforma web moderna para leer libros EPUB directamente en el navegador.

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado - 1 comando)

```bash
docker-compose up
```

Accede a: **http://localhost:3001**

Eso es todo. Frontend, Backend y Database se configuran automáticamente.

### Opción 2: Manual (Sin Docker)

```bash
# 1. Iniciar BD
docker-compose up postgres

# 2. Instalar y iniciar backend
cd backend
npm install
npm run db:init
npm run dev

# 3. Iniciar frontend (en otra terminal)
cd frontend
python -m http.server 3001
```

---

## 📋 Características Principales

✅ **Frontend** - Página de inicio e interfaz de biblioteca  
✅ **Backend** - API REST completa con Node.js + Express  
✅ **Database** - PostgreSQL con esquema relacional  
✅ **Docker** - Todo containerizado y listo para producción  

## 📁 Estructura del Proyecto

```
lectorEpub/
├── frontend/                   # Aplicación web (HTML + CSS + JS)
│   ├── index.html             # Página de inicio
│   ├── books.html             # Biblioteca de libros
│   ├── styles.css             # Estilos comunes
│   ├── books.css              # Estilos de biblioteca
│   ├── books.js               # Lógica de biblioteca
│   ├── Dockerfile             # Para containerizar
│   └── README.md
├── backend/                    # API REST (Node.js)
│   ├── src/
│   │   ├── index.js           # Servidor principal
│   │   ├── routes/            # Endpoints API
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── models/            # Consultas a BD
│   │   └── database/          # Configuración BD
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml         # Orquestación de servicios
├── QUICKSTART.md             # Guía rápida
├── DOCKER.md                 # Documentación Docker
├── CHEATSHEET.md             # Referencia de comandos
├── ARCHITECTURE.md           # Diseño del sistema
└── README.md                 # Este archivo
```

## 🔗 URLs de Acceso

| Componente | URL | Puerto |
|-----------|-----|--------|
| Frontend | http://localhost:3001 | 3001 |
| Backend API | http://localhost:3000/api | 3000 |
| PostgreSQL | localhost:5432 | 5432 |

## 📚 Documentación

- **[QUICKSTART.md](QUICKSTART.md)** - Inicio en 5 minutos
- **[DOCKER.md](DOCKER.md)** - Guía completa de Docker
- **[CHEATSHEET.md](CHEATSHEET.md)** - Referencia rápida
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Diseño técnico
- **[backend/README.md](backend/README.md)** - API completa
- **[frontend/README.md](frontend/README.md)** - Frontend

## 🏗️ Stack Técnico

| Componente | Tecnología |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 15 |
| **Containerización** | Docker, Docker Compose |

## 🎯 Endpoints API (Disponibles)

### Libros
```
GET    /api/books           → Obtener todos
GET    /api/books/:id       → Obtener uno
POST   /api/books           → Crear
PUT    /api/books/:id       → Actualizar
DELETE /api/books/:id       → Eliminar
```

### Capítulos
```
GET    /api/chapters/book/:bookId           → Obtener todos de un libro
GET    /api/chapters/:chapterId             → Obtener uno
POST   /api/chapters/book/:bookId           → Crear
PUT    /api/chapters/:chapterId             → Actualizar
DELETE /api/chapters/:chapterId             → Eliminar
```

## 🗄️ Modelo de Datos

### Tabla: books
- `id` (PK)
- `title` (Texto, requerido)
- `author` (Texto)
- `description` (Texto largo)
- `cover_url` (URL)
- `file_path` (Ruta del archivo)
- `created_at`, `updated_at` (Timestamps)

### Tabla: chapters
- `id` (PK)
- `book_id` (FK → books)
- `title` (Texto, requerido)
- `chapter_number` (Número, único por libro)
- `content` (HTML)
- `created_at` (Timestamp)

### Tabla: book_metadata
- `id` (PK)
- `book_id` (FK → books)
- `language`, `publisher`, `publication_date`, `isbn`

## 🐳 Docker Compose Services

```yaml
postgres:          # Base de datos PostgreSQL 15
backend:           # API REST Node.js + Express
frontend:          # Servidor estático con serve
```

## 🚦 Estados de Inicialización

1. ✅ **PostgreSQL** inicia primero
2. ✅ **Backend** espera a PostgreSQL + inicializa BD
3. ✅ **Frontend** espera al Backend
4. ✅ Todo accesible en http://localhost:3001

## 💡 Ejemplos de Uso

### Con Docker Compose
```bash
docker-compose up
```

### Crear un libro con curl
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "description": "Una novela clásica"
  }'
```

### Obtener libros
```bash
curl http://localhost:3000/api/books
```

## 🔧 Comandos Útiles

```bash
# Docker Compose
docker-compose up              # Iniciar todo
docker-compose down            # Detener todo
docker-compose logs -f         # Ver logs
docker-compose ps              # Estado de servicios

# Backend
npm run dev                    # Desarrollo con nodemon
npm start                      # Producción
npm run db:init               # Inicializar BD

# Frontend
python -m http.server 3001    # Servidor local
```

## 🛠️ Desarrollo

### Agregar nueva ruta
1. Crear controlador en `backend/src/controllers/`
2. Crear modelo en `backend/src/models/`
3. Definir rutas en `backend/src/routes/`
4. Importar en `backend/src/index.js`

### Agregar nueva sección frontend
1. Crear HTML en `frontend/`
2. Agregar estilos en `frontend/styles.css` o nuevo CSS
3. Agregar JavaScript si es necesario
4. Agregar enlaces en navbar

## 📈 Próximas Fases

- [ ] Parsing de archivos EPUB
- [ ] Extracción automática de metadatos
- [ ] Sanitización de contenido HTML
- [ ] Visor de libros interactivo
- [ ] Autenticación y autorización
- [ ] Búsqueda full-text
- [ ] Bookmarks y progreso de lectura
- [ ] Sincronización multi-dispositivo
- [ ] Anotaciones y highlights

## 📝 Requisitos

- **Docker** y **Docker Compose** (para la opción containerizada)
- O **Node.js 18+**, **PostgreSQL 15+**, **Python 3** (para desarrollo manual)

## 📄 Licencia

MIT

---

Para más información, consulta la documentación específica:
- Inicio: [QUICKSTART.md](QUICKSTART.md)
- Docker: [DOCKER.md](DOCKER.md)  
- Referencia: [CHEATSHEET.md](CHEATSHEET.md)
- Arquitectura: [ARCHITECTURE.md](ARCHITECTURE.md)