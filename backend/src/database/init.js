const pool = require('./db');

const initializeDatabase = async () => {
  try {
    console.log('Inicializando base de datos...');

    // Crear tabla de libros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        description TEXT,
        cover_url VARCHAR(500),
        file_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de capítulos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        chapter_number INTEGER NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, chapter_number)
      );
    `);

    // Crear tabla de metadatos adicionales
    await pool.query(`
      CREATE TABLE IF NOT EXISTS book_metadata (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        language VARCHAR(10),
        publisher VARCHAR(255),
        publication_date DATE,
        isbn VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id)
      );
    `);

    // Crear índices para optimización
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
    `);

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama como script
if (require.main === module) {
  initializeDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = initializeDatabase;
