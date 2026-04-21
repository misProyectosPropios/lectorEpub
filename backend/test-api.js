const http = require('http');

const BASE_URL = 'http://localhost:3000';

/**
 * Realiza una solicitud HTTP
 */
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Pruebas de API
 */
async function runTests() {
  console.log('🧪 Iniciando pruebas de la API...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Health Check');
    let result = await request('GET', '/');
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    console.log();

    // 2. Obtener todos los libros (vacío al inicio)
    console.log('2️⃣ Obtener todos los libros');
    result = await request('GET', '/api/books');
    console.log(`Status: ${result.status}`);
    console.log(`Books count: ${result.data.length}`);
    console.log();

    // 3. Crear un libro
    console.log('3️⃣ Crear un libro');
    const newBook = {
      title: 'El Quijote',
      author: 'Miguel de Cervantes',
      description: 'Una novela clásica de la literatura española',
      coverUrl: 'https://example.com/quijote.jpg'
    };
    result = await request('POST', '/api/books', newBook);
    console.log(`Status: ${result.status}`);
    const bookId = result.data.id;
    console.log(`Book created with ID: ${bookId}`);
    console.log(`Book data:`, result.data);
    console.log();

    // 4. Obtener el libro creado
    console.log('4️⃣ Obtener libro por ID');
    result = await request('GET', `/api/books/${bookId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Book:`, result.data);
    console.log();

    // 5. Crear capítulos
    console.log('5️⃣ Crear capítulos');
    const chapter1 = {
      title: 'Capítulo 1: El Hidalgo',
      chapterNumber: 1,
      content: '<h1>El Hidalgo</h1><p>En un lugar de la Mancha, de cuyo nombre no quiero acordarme...</p>'
    };
    result = await request('POST', `/api/chapters/book/${bookId}`, chapter1);
    console.log(`Status: ${result.status}`);
    const chapterId = result.data.id;
    console.log(`Chapter 1 created with ID: ${chapterId}`);
    console.log();

    // 6. Crear segundo capítulo
    console.log('6️⃣ Crear segundo capítulo');
    const chapter2 = {
      title: 'Capítulo 2: La Salida',
      chapterNumber: 2,
      content: '<h1>La Salida</h1><p>Pues llaneza de ingenio...</p>'
    };
    result = await request('POST', `/api/chapters/book/${bookId}`, chapter2);
    console.log(`Status: ${result.status}`);
    console.log();

    // 7. Obtener todos los capítulos del libro
    console.log('7️⃣ Obtener capítulos del libro');
    result = await request('GET', `/api/chapters/book/${bookId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Chapters count: ${result.data.length}`);
    result.data.forEach(ch => {
      console.log(`  - ID: ${ch.id}, Cap. ${ch.chapter_number}: "${ch.title}"`);
    });
    console.log();

    // 8. Obtener un capítulo específico
    console.log('8️⃣ Obtener capítulo específico');
    result = await request('GET', `/api/chapters/${chapterId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Chapter:`, result.data);
    console.log();

    // 9. Actualizar un capítulo
    console.log('9️⃣ Actualizar capítulo');
    const updateData = {
      title: 'Capítulo 1: El Hidalgo (Revisado)',
      content: '<h1>El Hidalgo</h1><p>Contenido actualizado...</p>'
    };
    result = await request('PUT', `/api/chapters/${chapterId}`, updateData);
    console.log(`Status: ${result.status}`);
    console.log(`Chapter updated:`, result.data);
    console.log();

    // 10. Actualizar un libro
    console.log('🔟 Actualizar libro');
    const updateBook = {
      description: 'Descripción actualizada del Quijote'
    };
    result = await request('PUT', `/api/books/${bookId}`, updateBook);
    console.log(`Status: ${result.status}`);
    console.log(`Book updated:`, result.data);
    console.log();

    // 11. Obtener todos los libros
    console.log('1️⃣1️⃣ Obtener todos los libros');
    result = await request('GET', '/api/books');
    console.log(`Status: ${result.status}`);
    console.log(`Total books: ${result.data.length}`);
    result.data.forEach(book => {
      console.log(`  - ID: ${book.id}, "${book.title}" (${book.chapter_count} capítulos)`);
    });
    console.log();

    // 12. Eliminar un capítulo
    console.log('1️⃣2️⃣ Eliminar capítulo');
    result = await request('DELETE', `/api/chapters/${chapterId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    console.log();

    // 13. Eliminar un libro
    console.log('1️⃣3️⃣ Eliminar libro');
    result = await request('DELETE', `/api/books/${bookId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    console.log();

    console.log('✅ ¡Todas las pruebas completadas exitosamente!');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
runTests();
