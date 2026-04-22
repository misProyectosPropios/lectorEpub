# 🐳 Docker Compose - Lector EPUB

Ejecuta toda la aplicación (frontend, backend y base de datos) con un solo comando.

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker instalado
- Docker Compose instalado

### Ejecutar Todo

```bash
# Desde la raíz del proyecto
docker-compose up
```

**Eso es todo.** El sistema se inicializará automáticamente:

1. **PostgreSQL** (puerto 5432) - Base de datos
2. **Backend** (puerto 3000) - API REST
3. **Frontend** (puerto 3001) - Página web

### Acceder a la Aplicación

- **Inicio:** http://localhost:3001/index.html
- **Biblioteca:** http://localhost:3001/books.html
- **API Backend:** http://localhost:3000/api/books

## 📊 Estructura de Servicios

```
┌─────────────────────────────────────────┐
│  Frontend (Node.js + serve)             │
│  http://localhost:3001                  │
│  ├── index.html    (Página de inicio)   │
│  └── books.html    (Biblioteca)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Backend (Node.js + Express)            │
│  http://localhost:3000                  │
│  └── /api/*        (Endpoints REST)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  PostgreSQL Database                    │
│  localhost:5432                         │
│  └── lector_epub                        │
└─────────────────────────────────────────┘
```

## 🛑 Detener los Servicios

```bash
# Parar en la terminal actual (Ctrl+C)
Ctrl+C

# O desde otra terminal
docker-compose down
```

## 🗑️ Limpiar Todo (incluyendo datos)

```bash
# Eliminar contenedores y volúmenes
docker-compose down -v

# Eliminar imágenes también
docker-compose down -v --rmi all
```

## 🔍 Comandos Útiles

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo el backend
docker-compose logs -f backend

# Solo el frontend
docker-compose logs -f frontend

# Solo la base de datos
docker-compose logs -f postgres
```

### Acceder a la base de datos

```bash
# Conexión interactiva a PostgreSQL
docker-compose exec postgres psql -U lector_user -d lector_epub

# Comandos útiles en psql
\dt                          # Ver tablas
SELECT * FROM books;         # Ver libros
SELECT * FROM chapters;      # Ver capítulos
\q                           # Salir
```

### Ejecutar comandos en los contenedores

```bash
# En el backend
docker-compose exec backend npm run db:init

# En el frontend
docker-compose exec frontend sh

# En PostgreSQL
docker-compose exec postgres psql -U lector_user
```

## 📝 Variables de Entorno

Las variables de entorno se definen en `docker-compose.yml`:

```yaml
backend:
  environment:
    DATABASE_URL: postgresql://lector_user:lector_password@postgres:5432/lector_epub
    NODE_ENV: production
    PORT: 3000
```

## 🔧 Personalización

### Cambiar Puertos

Edita `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3000:3000"  # Puerto local : Puerto contenedor

  frontend:
    ports:
      - "3001:3001"

  postgres:
    ports:
      - "5432:5432"
```

### Cambiar Credenciales de BD

En `docker-compose.yml`:

```yaml
postgres:
  environment:
    POSTGRES_USER: lector_user
    POSTGRES_PASSWORD: tu_password  # Cambiar aquí
    POSTGRES_DB: lector_epub
```

También actualiza el `backend` en la misma sección:

```yaml
backend:
  environment:
    DATABASE_URL: postgresql://lector_user:tu_password@postgres:5432/lector_epub
```

## 🐛 Troubleshooting

### El backend no se conecta a la BD

```bash
# Ver logs del backend
docker-compose logs backend

# Esperar a que PostgreSQL esté listo
docker-compose logs postgres
```

### Puerto ya en uso

```bash
# Ver qué usa el puerto
docker ps

# Cambiar puerto en docker-compose.yml
# O matar el proceso que usa el puerto
```

### Frontend no carga libros

```bash
# Verificar que el backend esté en http://localhost:3000
# Abrir Developer Tools (F12) en el navegador
# Ver la pestaña Network para ver las solicitudes
```

### Reconstruir imágenes

```bash
# Reconstruir después de cambiar Dockerfile
docker-compose up --build

# Reconstruir un servicio específico
docker-compose build backend
docker-compose up
```

## 📦 Archivos Generados

Docker Compose crea automáticamente:

- `lector_epub_db` - Contenedor de PostgreSQL
- `lector_epub_backend` - Contenedor de Backend
- `lector_epub_frontend` - Contenedor de Frontend
- Red Docker `lector-network` - Para comunicación entre servicios
- Volumen `postgres_data` - Persistencia de datos

## 📊 Verificar Estado

```bash
# Ver todos los contenedores
docker ps

# Ver solo los de este proyecto
docker ps | grep lector

# Ver información de los servicios
docker-compose ps
```

## 🔄 Flujo de Inicialización

Cuando ejecutas `docker-compose up`:

1. **PostgreSQL** inicia y espera a estar listo
2. **Backend** espera a que PostgreSQL esté listo
3. **Backend** ejecuta `npm run db:init` (crea tablas)
4. **Backend** inicia en puerto 3000
5. **Frontend** inicia en puerto 3001
6. **Frontend** está listo (accede a http://localhost:3001)

## ✅ Verificación Final

Si todo está funcionando correctamente, deberías ver:

```
✓ PostgreSQL corriendo en localhost:5432
✓ Backend respondiendo en http://localhost:3000
✓ Frontend servido en http://localhost:3001
✓ Base de datos inicializada con tablas
```

Abre http://localhost:3001 en tu navegador. ¡Debería cargar!

## 📚 Próximas Mejoras

- [ ] Agregar nginx como reverse proxy
- [ ] Implementar hot-reload en desarrollo
- [ ] Separar docker-compose para desarrollo y producción
- [ ] Agregar base de datos de pruebas
- [ ] Configurar CI/CD
