const express = require('express');
const router = express.Router();
const ChapterController = require('../controllers/ChapterController');

// GET /api/chapters/book/:bookId - Obtener todos los capítulos de un libro
router.get('/book/:bookId', ChapterController.getChaptersByBook);

// GET /api/chapters/:chapterId - Obtener un capítulo por ID
router.get('/:chapterId', ChapterController.getChapter);

// GET /api/chapters/book/:bookId/number/:chapterNumber - Obtener capítulo por número
router.get('/book/:bookId/number/:chapterNumber', ChapterController.getChapterByNumber);

// POST /api/chapters/book/:bookId - Crear un nuevo capítulo
router.post('/book/:bookId', ChapterController.createChapter);

// PUT /api/chapters/:chapterId - Actualizar un capítulo
router.put('/:chapterId', ChapterController.updateChapter);

// DELETE /api/chapters/:chapterId - Eliminar un capítulo
router.delete('/:chapterId', ChapterController.deleteChapter);

module.exports = router;
