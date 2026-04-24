const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const BookController = require('../controllers/BookController');

// Configuración de multer para almacenar libros en la carpeta /books
const upload = multer({ dest: 'books/' });

// GET /api/books - Obtener todos los libros
router.get('/', BookController.getAllBooks);

// GET /api/books/:id - Obtener un libro por ID
router.get('/:id', BookController.getBookById);

// GET /api/books/name/:name - Obtener un libro por nombre (título)
router.get('/name/:name', BookController.getBookByName);

// POST /api/books - Crear un nuevo libro
router.post('/', upload.single('book'), BookController.createBook);

// PUT /api/books/:id - Actualizar un libro
router.put('/:id', BookController.updateBook);

// DELETE /api/books/:id - Eliminar un libro
router.delete('/:id', BookController.deleteBook);

// DELETE /api/books - Eliminar todos los libros y limpiar archivos
router.delete('/', BookController.clearLibrary);

module.exports = router;
