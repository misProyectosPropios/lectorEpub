# ✅ Verificación - Todo Funcionando

Después de ejecutar `docker-compose up`, verifica que todo esté correcto:

## 🔍 Checklist de Inicio

### 1. Docker Compose en Ejecución
```bash
# En otra terminal, verifica los servicios
docker-compose ps

# Deberías ver:
# NAME                    STATUS
# lector_epub_postgres    Up (healthy)
# lector_epub_backend     Up
# lector_epub_frontend    Up
```

### 2. Verificar Logs

```bash
# Ver logs de inicialización
docker-compose logs

# Deberías ver algo como:
# backend_1  | Servidor ejecutándose en puerto 3000
# frontend_1 | ▲ Accepting connections at http://localhost:3001
# postgres_1 | database system is ready to accept connections
```

### 3. Acceder a Servicios

#### Frontend (Página de Inicio)
```
http://localhost:3001/index.html
```
✅ Deberías ver la página de bienvenida

#### Frontend (Biblioteca)
```
http://localhost:3001/books.html
```
✅ Deberías ver "No hay libros disponibles" (hasta que agregues datos)

#### Backend (API Health)
```
http://localhost:3000
```
✅ Deberías ver:
```json
{
  "message": "Lector EPUB API",
  "status": "online",
  "version": "0.1.0"
}
```

#### Backend (API - Obtener Libros)
```
http://localhost:3000/api/books
```
✅ Deberías ver un array vacío: `[]`

### 4. Base de Datos

```bash
# Conectarse a PostgreSQL
docker-compose exec postgres psql -U lector_user -d lector_epub

# Dentro de psql, verifica las tablas
\dt

# Deberías ver:
# books, chapters, book_metadata
```

---

## 🧪 Prueba de Funcionalidad

### Crear un Libro de Prueba

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "description": "Una novela de aventuras"
  }'
```

✅ Deberías recibir una respuesta con el libro creado

### Ver Libro en Frontend

1. Abre http://localhost:3001/books.html
2. Deberías ver la tarjeta del libro creado
3. Haz clic en "Seleccionar" - el botón debe cambiar a "✓ Seleccionado"

### Agregar Capítulo

```bash
# Primero obtén el ID del libro
curl http://localhost:3000/api/books

# Luego crea un capítulo (reemplaza {BOOK_ID} con el ID obtenido)
curl -X POST http://localhost:3000/api/chapters/book/{BOOK_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Capítulo 1",
    "chapterNumber": 1,
    "content": "<h1>El Hidalgo</h1><p>En un lugar de la Mancha...</p>"
  }'
```

---

## ⚠️ Troubleshooting

### "El navegador dice que no puede conectar a localhost:3001"

```bash
# Verifica que Docker Compose está ejecutándose
docker-compose ps

# Si no ve el frontend, reinicia
docker-compose down
docker-compose up
```

### "El frontend carga pero no muestra libros"

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Actualiza la página
4. Busca solicitud a `http://localhost:3000/api/books`
5. Verifica que devuelve datos o error

### "Error de conexión a BD desde backend"

```bash
# Ver logs del backend
docker-compose logs backend

# Ver logs de PostgreSQL
docker-compose logs postgres

# Si PostgreSQL tarda mucho, espera un minuto y recarga
```

### "Puerto ya en uso"

```bash
# Ver qué usa el puerto
docker ps | grep 3000
docker ps | grep 3001
docker ps | grep 5432

# O reinicia Docker Compose
docker-compose down -v
docker-compose up --build
```

---

## 📊 Estructura de Red

```
Navegador (http://localhost:3001)
    ↓
┌─────────────────────────────────────────┐
│ Frontend Container (serve)              │ Port 3001
│ http://localhost:3001                   │
└─────────────────────────────────────────┘
    ↓ (fetch a localhost:3000)
┌─────────────────────────────────────────┐
│ Backend Container (Express)             │ Port 3000
│ http://localhost:3000/api               │
└─────────────────────────────────────────┘
    ↓ (conexión por nombre "postgres")
┌─────────────────────────────────────────┐
│ PostgreSQL Container                    │ Port 5432
│ postgresql://postgres:5432              │
└─────────────────────────────────────────┘
```

---

## ✅ Estados Esperados

| Servicio | Estado | Acceso |
|----------|--------|--------|
| PostgreSQL | 🟢 Healthy | localhost:5432 |
| Backend | 🟢 Running | http://localhost:3000 |
| Frontend | 🟢 Running | http://localhost:3001 |

Si todos están verdes, ¡está funcionando correctamente!

---

## 🎯 Próximas Acciones

### Cargar Datos de Prueba
```bash
# Ejecutar script de pruebas
docker-compose exec backend node test-api.js
```

### Agregar Más Libros
- Usa curl o Postman para POST a `/api/books`
- Los libros aparecerán automáticamente en http://localhost:3001/books.html

### Desarrollo
- Edita archivos del frontend (sin reiniciar)
- Edita archivos del backend y reinicia:
```bash
docker-compose restart backend
```

---

## 📞 Soporte

Si algo no funciona:

1. **Ver logs completos:** `docker-compose logs`
2. **Reiniciar todo:** `docker-compose down && docker-compose up`
3. **Limpiar todo:** `docker-compose down -v` (elimina datos)
4. **Reconstruir:** `docker-compose up --build`

---

¡Listo! Tu plataforma Lector EPUB está funcionando con Docker Compose. 🚀
