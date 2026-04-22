const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '../../../../books')
});

// GET /api/books - Obtener todos los libros
router.get('/', BookController.getAllBooks);

// GET /api/books/:id - Obtener un libro por ID
router.get('/:id', BookController.getBookById);

// POST /api/books - Crear un nuevo libro
router.post('/', upload.single('book'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // File uploaded successfully
  res.status(200).json({
    message: 'Book uploaded successfully',
    file: req.file
  });
});

// PUT /api/books/:id - Actualizar un libro
router.put('/:id', BookController.updateBook);

// DELETE /api/books/:id - Eliminar un libro
router.delete('/:id', BookController.deleteBook);

module.exports = router;
