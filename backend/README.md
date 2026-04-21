# Backend - Lector EPUB

Backend API para la plataforma de lectura de libros EPUB construida con Node.js, Express y PostgreSQL.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── index.js              # Servidor principal
│   ├── database/
│   │   ├── db.js             # Configuración de conexión a BD
│   │   └── init.js           # Inicialización del esquema
│   ├── models/
│   │   ├── Book.js           # Modelo de Libro
│   │   └── Chapter.js        # Modelo de Capítulo
│   ├── controllers/
│   │   ├── BookController.js       # Lógica de Libros
│   │   └── ChapterController.js    # Lógica de Capítulos
│   └── routes/
│       ├── books.js          # Rutas de Libros
│       └── chapters.js       # Rutas de Capítulos
├── package.json              # Dependencias del proyecto
├── .env.example              # Variables de entorno
└── .gitignore
```

## Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos

Levantar PostgreSQL con Docker Compose (desde la raíz del proyecto):

```bash
docker-compose up -d
```

Esto crea un contenedor PostgreSQL con:
- Usuario: `lector_user`
- Contraseña: `lector_password`
- Base de datos: `lector_epub`
- Puerto: `5432`

### 3. Inicializar Schema de Base de Datos

```bash
npm run db:init
```

Esto crea las tablas necesarias:
- `books`: Almacena información de los libros
- `chapters`: Almacena los capítulos de cada libro
- `book_metadata`: Metadatos adicionales de libros

### 4. Crear archivo `.env`

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Asegúrate de que las variables coincidan con tu configuración de PostgreSQL.

## Ejecutar el Servidor

### Modo Desarrollo (con nodemon)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## Endpoints API

### Libros

- **GET** `/api/books` - Obtener todos los libros
- **GET** `/api/books/:id` - Obtener un libro específico
- **POST** `/api/books` - Crear un nuevo libro
- **PUT** `/api/books/:id` - Actualizar un libro
- **DELETE** `/api/books/:id` - Eliminar un libro

### Capítulos

- **GET** `/api/chapters/book/:bookId` - Obtener todos los capítulos de un libro
- **GET** `/api/chapters/:chapterId` - Obtener un capítulo específico
- **GET** `/api/chapters/book/:bookId/number/:chapterNumber` - Obtener capítulo por número
- **POST** `/api/chapters/book/:bookId` - Crear un nuevo capítulo
- **PUT** `/api/chapters/:chapterId` - Actualizar un capítulo
- **DELETE** `/api/chapters/:chapterId` - Eliminar un capítulo

## Ejemplos de Uso

### Crear un Libro

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "description": "Una novela clásica de la literatura española",
    "coverUrl": "https://example.com/cover.jpg",
    "filePath": "/books/quijote.epub"
  }'
```

### Obtener todos los Libros

```bash
curl http://localhost:3000/api/books
```

### Crear un Capítulo

```bash
curl -X POST http://localhost:3000/api/chapters/book/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Capítulo 1: El Hidalgo",
    "chapterNumber": 1,
    "content": "<h1>El Hidalgo</h1><p>Contenido del capítulo...</p>"
  }'
```

## Base de Datos - Esquema

### Tabla: books
- `id` (SERIAL, PRIMARY KEY)
- `title` (VARCHAR 255, NOT NULL)
- `author` (VARCHAR 255)
- `description` (TEXT)
- `cover_url` (VARCHAR 500)
- `file_path` (VARCHAR 500)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabla: chapters
- `id` (SERIAL, PRIMARY KEY)
- `book_id` (INTEGER, FOREIGN KEY → books.id)
- `title` (VARCHAR 255, NOT NULL)
- `chapter_number` (INTEGER, NOT NULL)
- `content` (TEXT)
- `created_at` (TIMESTAMP)
- Constraints: UNIQUE(book_id, chapter_number)

### Tabla: book_metadata
- `id` (SERIAL, PRIMARY KEY)
- `book_id` (INTEGER, FOREIGN KEY → books.id)
- `language` (VARCHAR 10)
- `publisher` (VARCHAR 255)
- `publication_date` (DATE)
- `isbn` (VARCHAR 20)
- `created_at` (TIMESTAMP)

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **pg** - Driver de PostgreSQL para Node.js
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

## Notas de Desarrollo

- ✅ API básica sin autenticación (implementar después)
- ✅ Manejo de errores básico
- ✅ Validación mínima de entrada
- ⏳ Parsing de archivos EPUB (próximo paso)
- ⏳ Sanitización de contenido HTML (próximo paso)
- ⏳ Búsqueda full-text (futuro)
