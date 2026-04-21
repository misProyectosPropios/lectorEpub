const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

// GET /api/books - Obtener todos los libros
router.get('/', BookController.getAllBooks);

// GET /api/books/:id - Obtener un libro por ID
router.get('/:id', BookController.getBookById);

// POST /api/books - Crear un nuevo libro
router.post('/', BookController.createBook);

// PUT /api/books/:id - Actualizar un libro
router.put('/:id', BookController.updateBook);

// DELETE /api/books/:id - Eliminar un libro
router.delete('/:id', BookController.deleteBook);

module.exports = router;
