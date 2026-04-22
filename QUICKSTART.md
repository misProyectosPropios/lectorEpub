# Guía de Inicio Rápido - Lector EPUB

## � Opción 1: Con Docker Compose (Recomendado)

La forma más rápida y sencilla:

```bash
docker-compose up
```

**¡Eso es!** En 1-2 minutos todo estará listo:

- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:3000/api
- **Database:** PostgreSQL (automático)

Presiona `Ctrl+C` para detener.

---

## 🚀 Opción 2: Manual (Sin Docker)

### 1. Levantar la Base de Datos

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

Verifica que PostgreSQL esté corriendo:
```bash
docker ps
# Deberías ver un contenedor llamado "lector_epub_db"
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Inicializar la Base de Datos

```bash
npm run db:init
```

Deberías ver:
```
Inicializando base de datos...
Base de datos inicializada correctamente
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

Verifica que esté ejecutándose:
```
Servidor ejecutándose en puerto 3000
```

### 5. Probar la API

Abre en tu navegador o usa `curl`:

```bash
# Health check
curl http://localhost:3000

# Obtener todos los libros (debería retornar array vacío)
curl http://localhost:3000/api/books

# Crear un libro de prueba
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prueba",
    "author": "Test",
    "description": "Libro de prueba"
  }'
```

---

## 📋 Estructura Actual

```
lectorEpub/
├── backend/
│   ├── src/
│   │   ├── index.js              (Servidor Express)
│   │   ├── database/             (Conexión a BD)
│   │   ├── models/               (Book, Chapter)
│   │   ├── controllers/          (Lógica de negocio)
│   │   └── routes/               (Endpoints de la API)
│   ├── package.json
│   └── README.md
├── docker-compose.yml            (PostgreSQL)
├── README.md
└── agent.md
```

---

## 🛠️ Comandos Útiles

### Backend
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Inicializar BD
npm run db:init

# Iniciar en producción
npm start
```

### Docker
```bash
# Levantar servicios
docker compose up -d

# Detener servicios
docker compose down

# Ver logs
docker compose logs -f postgres

# Acceder a PostgreSQL
docker exec -it lector_epub_db psql -U lector_user -d lector_epub
```

---

## 📊 API Endpoints

### Libros (`/api/books`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los libros |
| GET | `/:id` | Obtener libro por ID |
| POST | `/` | Crear nuevo libro |
| PUT | `/:id` | Actualizar libro |
| DELETE | `/:id` | Eliminar libro |

### Capítulos (`/api/chapters`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/book/:bookId` | Obtener capítulos de un libro |
| GET | `/:chapterId` | Obtener capítulo por ID |
| POST | `/book/:bookId` | Crear capítulo |
| PUT | `/:chapterId` | Actualizar capítulo |
| DELETE | `/:chapterId` | Eliminar capítulo |

---

## 🗄️ Base de Datos

**Tablas creadas:**
- `books` - Información de libros
- `chapters` - Contenido de capítulos
- `book_metadata` - Metadatos adicionales

Para más detalles, consulta [backend/README.md](backend/README.md)

---

## 📝 Próximos Pasos

- [ ] Implementar parsing de archivos EPUB
- [ ] Agregar extracción automática de metadatos
- [ ] Sanitizar contenido HTML
- [ ] Crear frontend en React
- [ ] Agregar autenticación y autorización
- [ ] Implementar búsqueda full-text
- [ ] Agregar bookmarks y progreso de lectura

---

## ⚙️ Troubleshooting

### Puerto 5432 en uso
Si PostgreSQL ya está corriendo:
```bash
docker-compose down
docker-compose up -d
```

### Error de conexión a BD
Verifica que las credenciales en `.env` coincidan con `docker-compose.yml`:
```
DATABASE_URL=postgresql://lector_user:lector_password@localhost:5432/lector_epub
```

### Base de datos no inicializada
Asegúrate de ejecutar:
```bash
cd backend
npm run db:init
```

---

## 📚 Información Adicional

- [DOCKER.md](DOCKER.md) - Documentación completa de Docker Compose
- [CHEATSHEET.md](CHEATSHEET.md) - Referencia rápida de comandos
- [Backend README](backend/README.md) - Detalles técnicos del backend
