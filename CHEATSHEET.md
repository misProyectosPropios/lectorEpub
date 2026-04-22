# 📝 Referencia Rápida de Comandos

## � Docker Compose (Recomendado)

```bash
# Ejecutar TODO (Frontend + Backend + Database)
docker-compose up

# Ejecutar en background
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir imágenes
docker-compose up --build
```

**Acceso después de ejecutar:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Database: localhost:5432

---

## 🚀 Inicio del Proyecto (Sin Docker - Forma Antigua)

```bash
# 1. Levantar BD con Docker
docker-compose up -d

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Inicializar esquema de BD
npm run db:init

# 4. Iniciar servidor en desarrollo
npm run dev
```

---

## 📦 Instalación de Dependencias

```bash
# Backend
cd backend
npm install

# Instalar paquete específico
npm install nombre-paquete
```

---

## 🛠️ Scripts del Backend

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start

# Inicializar base de datos
npm run db:init

# Probar API
node test-api.js
```

---

## 🐳 Docker Compose

```bash
# Iniciar todo
docker-compose up

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Acceder a la BD
docker-compose exec postgres psql -U lector_user -d lector_epub

# Detener todo
docker-compose down

# Limpiar todo (incluyendo datos)
docker-compose down -v
```

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver contenedores corriendo
docker ps
```

---

## 🗄️ Acceso a PostgreSQL

```bash
# Conectarse a la BD desde terminal
docker exec -it lector_epub_db psql -U lector_user -d lector_epub

# Comandos útiles en psql
\dt                          # Ver todas las tablas
\d books                      # Ver estructura de tabla
SELECT * FROM books;         # Ver datos
SELECT * FROM chapters;      # Ver capítulos
\q                           # Salir
```

---

## 🔌 Endpoints API

### Base URL
```
http://localhost:3000
```

### Libros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/books` | Obtener todos |
| GET | `/api/books/:id` | Obtener uno |
| POST | `/api/books` | Crear |
| PUT | `/api/books/:id` | Actualizar |
| DELETE | `/api/books/:id` | Eliminar |

### Capítulos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/chapters/book/:bookId` | Obtener todos de un libro |
| GET | `/api/chapters/:chapterId` | Obtener uno |
| POST | `/api/chapters/book/:bookId` | Crear |
| PUT | `/api/chapters/:chapterId` | Actualizar |
| DELETE | `/api/chapters/:chapterId` | Eliminar |

---

## 🧪 Ejemplos de Curl

### Crear Libro

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "description": "Una novela clásica",
    "coverUrl": "https://example.com/cover.jpg"
  }'
```

### Obtener Todos los Libros

```bash
curl http://localhost:3000/api/books
```

### Crear Capítulo

```bash
curl -X POST http://localhost:3000/api/chapters/book/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Capítulo 1",
    "chapterNumber": 1,
    "content": "<h1>Capítulo 1</h1><p>Contenido...</p>"
  }'
```

### Actualizar Libro

```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"description": "Nueva descripción"}'
```

### Eliminar Libro

```bash
curl -X DELETE http://localhost:3000/api/books/1
```

---

## 📁 Estructura de Carpetas

```
lectorEpub/
├── backend/              ← Backend Node.js
│   ├── src/
│   │   ├── index.js      ← Servidor principal
│   │   ├── models/       ← Queries a BD
│   │   ├── controllers/  ← Lógica de negocio
│   │   ├── routes/       ← Endpoints
│   │   └── database/     ← Conexión a BD
│   ├── package.json
│   ├── test-api.js
│   └── README.md
├── books/                ← Almacén de archivos EPUB
├── docker-compose.yml    ← PostgreSQL
├── QUICKSTART.md         ← Inicio rápido
├── ARCHITECTURE.md       ← Diseño del sistema
└── CHEATSHEET.md         ← Este archivo
```

---

## 🛑 Detener Todo

```bash
# Detener servidor (Ctrl+C en la terminal)
Ctrl+C

# Detener PostgreSQL
docker-compose down

# Detener todo y limpiar volúmenes (⚠️ elimina datos)
docker-compose down -v
```

---

## ⚠️ Troubleshooting

### Puerto 3000 en uso

```bash
# Encontrar qué usa el puerto
netstat -ano | findstr :3000

# Matar proceso en Windows
taskkill /PID <PID> /F
```

### Puerto 5432 en uso

```bash
# Detener Docker
docker-compose down

# Reiniciar
docker-compose up -d
```

### No se conecta a BD

```bash
# Verificar que Docker está corriendo
docker ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar credenciales en .env
# DATABASE_URL=postgresql://lector_user:lector_password@localhost:5432/lector_epub
```

### Base de datos no existe

```bash
# Reinicializar
npm run db:init
```

---

## 📚 Archivos de Documentación

- [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- [ARCHITECTURE.md](ARCHITECTURE.md) - Diseño del sistema
- [backend/README.md](backend/README.md) - Documentación del backend
- [agent.md](agent.md) - Especificaciones del proyecto

---

## 💡 Consejos

- Usa `npm run dev` en desarrollo (reinicia automáticamente)
- Usa `docker-compose logs -f` para ver errores en tiempo real
- El script `test-api.js` es útil para validar que todo funciona
- Mantén `.env` en `.gitignore` por seguridad
- Consulta `backend/README.md` para endpoints completos

