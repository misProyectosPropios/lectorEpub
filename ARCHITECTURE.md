# 🏗️ Arquitectura de Solución - Lector EPUB

## Vista General

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                   (Próxima implementación)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HTTP/REST API                                                  │
│  ↕                                                              │
├─────────────────────────────────────────────────────────────────┤
│  BACKEND (Node.js + Express)                                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  API Routes                                            │   │
│  │  ├── /api/books (CRUD)                                │   │
│  │  └── /api/chapters (CRUD)                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↕                                     │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Controllers                                           │   │
│  │  ├── BookController                                   │   │
│  │  └── ChapterController                                │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↕                                     │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Models                                                │   │
│  │  ├── Book (queries a BD)                              │   │
│  │  └── Chapter (queries a BD)                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↕                                     │
├─────────────────────────────────────────────────────────────────┤
│  DATABASE CONNECTION POOL                                       │
│  (pg - PostgreSQL driver)                                       │
├─────────────────────────────────────────────────────────────────┤
│                           ↕                                     │
├─────────────────────────────────────────────────────────────────┤
│  POSTGRESQL DATABASE (Docker Container)                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Tables                                                │   │
│  │  ├── books                                             │   │
│  │  ├── chapters                                          │   │
│  │  └── book_metadata                                     │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. Backend (Node.js + Express)

**Ubicación:** `backend/src/`

**Responsabilidades:**
- Exponer API REST para operaciones CRUD de libros y capítulos
- Procesar solicitudes HTTP
- Validar datos de entrada (básico)
- Conectar con la base de datos
- Retornar respuestas JSON

**Tecnologías:**
- **Express**: Framework web minimalista
- **pg**: Driver de PostgreSQL
- **dotenv**: Gestión de variables de entorno
- **CORS**: Soporte para solicitudes cross-origin

### 2. Base de Datos (PostgreSQL)

**Ubicación:** Docker Container (port 5432)

**Tablas:**

#### `books`
Almacena información de cada libro EPUB
```sql
- id: Identificador único
- title: Título del libro
- author: Autor del libro
- description: Descripción breve
- cover_url: URL de la portada
- file_path: Ruta del archivo EPUB
- created_at: Fecha de creación
- updated_at: Fecha de última actualización
```

#### `chapters`
Contiene los capítulos de cada libro
```sql
- id: Identificador único
- book_id: Referencia al libro (FK)
- title: Título del capítulo
- chapter_number: Número secuencial del capítulo
- content: Contenido HTML del capítulo
- created_at: Fecha de creación
```

#### `book_metadata`
Metadatos adicionales
```sql
- id: Identificador único
- book_id: Referencia al libro (FK)
- language: Idioma del libro
- publisher: Editorial
- publication_date: Fecha de publicación
- isbn: ISBN del libro
```

### 3. Modelos (ORM manual)

**Ubicación:** `backend/src/models/`

- **Book.js**: Métodos para interactuar con la tabla `books`
  - `findAll()`: Obtener todos los libros
  - `findById(id)`: Obtener libro por ID
  - `create()`: Crear nuevo libro
  - `update()`: Actualizar libro
  - `delete()`: Eliminar libro

- **Chapter.js**: Métodos para interactuar con la tabla `chapters`
  - `findByBookId()`: Obtener capítulos de un libro
  - `findById()`: Obtener capítulo por ID
  - `findByBookAndChapter()`: Obtener capítulo por número
  - `create()`: Crear capítulo
  - `update()`: Actualizar capítulo
  - `delete()`: Eliminar capítulo

### 4. Controladores

**Ubicación:** `backend/src/controllers/`

Contienen la lógica de negocio:

- **BookController**: Maneja solicitudes relacionadas con libros
  - Valida entrada
  - Llama a métodos del modelo
  - Retorna respuestas HTTP

- **ChapterController**: Maneja solicitudes relacionadas con capítulos
  - Valida entrada
  - Maneja relaciones libro-capítulo
  - Retorna respuestas HTTP

### 5. Rutas (Endpoints)

**Ubicación:** `backend/src/routes/`

Definen los endpoints de la API:

- **books.js**:
  ```
  GET    /api/books              → getAllBooks
  GET    /api/books/:id          → getBookById
  POST   /api/books              → createBook
  PUT    /api/books/:id          → updateBook
  DELETE /api/books/:id          → deleteBook
  ```

- **chapters.js**:
  ```
  GET    /api/chapters/book/:bookId                      → getChaptersByBook
  GET    /api/chapters/:chapterId                        → getChapter
  GET    /api/chapters/book/:bookId/number/:chapterNumber → getChapterByNumber
  POST   /api/chapters/book/:bookId                      → createChapter
  PUT    /api/chapters/:chapterId                        → updateChapter
  DELETE /api/chapters/:chapterId                        → deleteChapter
  ```

---

## Flujo de una Solicitud

### Ejemplo: Obtener un Libro

```
1. Cliente (Frontend/Postman)
   │
   ├─→ GET http://localhost:3000/api/books/1
   │
2. Express Server (index.js)
   │
   ├─→ Recibe la solicitud
   ├─→ Enruta a books.js (router)
   │
3. Ruta (routes/books.js)
   │
   ├─→ Mapea GET /books/:id a BookController.getBookById()
   │
4. Controlador (controllers/BookController.js)
   │
   ├─→ Extrae el parámetro :id
   ├─→ Llama a Book.findById(id)
   ├─→ Maneja errores
   ├─→ Retorna JSON con la respuesta
   │
5. Modelo (models/Book.js)
   │
   ├─→ Prepara consulta SQL
   ├─→ Ejecuta en la pool de conexiones
   │
6. Base de Datos (PostgreSQL)
   │
   ├─→ Procesa consulta
   ├─→ Retorna resultados
   │
7. Modelo
   │
   ├─→ Retorna filas a Controlador
   │
8. Controlador
   │
   ├─→ Formatea respuesta JSON
   ├─→ Retorna res.json(book)
   │
9. Express
   │
   ├─→ Envía respuesta HTTP al cliente
   │
10. Cliente
    │
    └─→ Recibe JSON con datos del libro
```

---

## Flujo de Datos

### Crear un Libro

```json
// Solicitud POST /api/books
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "description": "Una novela clásica"
}

// Procesamiento
1. BookController.createBook()
   ├─ Valida que title exista
   ├─ Llama Book.create()
   │
2. Book.create()
   ├─ Prepara query: INSERT INTO books (...)
   ├─ Ejecuta query
   ├─ Retorna fila insertada
   │
3. BookController
   ├─ Retorna 201 Created

// Respuesta
{
  "id": 1,
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "description": "Una novela clásica",
  "cover_url": null,
  "file_path": null,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

---

## Configuración del Entorno

### Variables de Entorno (.env)

```bash
# Base de datos
DATABASE_URL=postgresql://lector_user:lector_password@localhost:5432/lector_epub

# Servidor
NODE_ENV=development
PORT=3000
```

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: lector_user
      POSTGRES_PASSWORD: lector_password
      POSTGRES_DB: lector_epub
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## Ciclo de Vida de la Aplicación

### Startup

```
1. npm run dev (inicia nodemon)
2. Carga .env
3. Inicializa servidor Express
4. Crea pool de conexiones a PostgreSQL
5. Escucha en puerto 3000
6. ✅ Servidor listo
```

### Shutdown

```
1. Ctrl+C
2. Cierra todas las conexiones pendientes
3. Destruye pool de conexiones
4. Cierra servidor
5. ✅ Aplicación terminada
```

---

## Próximos Pasos de Desarrollo

### Fase 2: Parsing de EPUB
- [ ] Leer archivos EPUB como ZIP
- [ ] Extraer metadatos (metadata.xml)
- [ ] Extraer capítulos (content.opf)
- [ ] Parsear contenido HTML

### Fase 3: Frontend
- [ ] Crear componentes React
- [ ] Listar libros
- [ ] Visor de capítulos
- [ ] Navegación entre capítulos

### Fase 4: Seguridad
- [ ] Autenticación JWT
- [ ] Autorización (roles)
- [ ] Validación de entrada mejorada
- [ ] Rate limiting

### Fase 5: Funcionalidades Avanzadas
- [ ] Búsqueda full-text
- [ ] Bookmarks y progreso
- [ ] Sincronización entre dispositivos
- [ ] Comentarios y anotaciones

---

## Herramientas Útiles

### Testing API

```bash
# Usar el script de pruebas incluido
node backend/test-api.js

# O usar curl
curl http://localhost:3000/api/books

# O usar herramientas como Postman, Insomnia, etc.
```

### Debugging

```bash
# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Acceder a la BD directamente
docker exec -it lector_epub_db psql -U lector_user -d lector_epub

# Ver tablas
\dt

# Ver datos
SELECT * FROM books;
```

---

## Estructura Final de Carpetas

```
lectorEpub/
├── backend/
│   ├── src/
│   │   ├── index.js                    (Servidor principal)
│   │   ├── database/
│   │   │   ├── db.js                   (Pool de conexión)
│   │   │   └── init.js                 (Inicialización BD)
│   │   ├── models/
│   │   │   ├── Book.js                 (Queries de libros)
│   │   │   └── Chapter.js              (Queries de capítulos)
│   │   ├── controllers/
│   │   │   ├── BookController.js       (Lógica de libros)
│   │   │   └── ChapterController.js    (Lógica de capítulos)
│   │   └── routes/
│   │       ├── books.js                (Endpoints de libros)
│   │       └── chapters.js             (Endpoints de capítulos)
│   ├── package.json                    (Dependencias)
│   ├── .env.example                    (Variables de ejemplo)
│   ├── .gitignore
│   ├── README.md                       (Documentación backend)
│   └── test-api.js                     (Script de pruebas)
├── docker-compose.yml                  (PostgreSQL container)
├── QUICKSTART.md                       (Guía de inicio rápido)
├── README.md                           (Descripción del proyecto)
└── agent.md                            (Especificaciones del proyecto)
```

---

## Resumen

✅ **Completado:**
- Backend con Express configurado
- Base de datos PostgreSQL con esquema relacional
- Modelos para Book y Chapter
- Controladores con lógica básica
- Rutas CRUD completas para ambas entidades
- Docker Compose para BD
- Documentación y guías de inicio rápido
- Script de pruebas de API

⏳ **Próximas fases:**
- Parsing de archivos EPUB
- Sanitización de contenido HTML
- Frontend React
- Autenticación y autorización
- Búsqueda y filtrado avanzado
