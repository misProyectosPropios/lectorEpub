const Chapter = require('../models/Chapter');

class ChapterController {
  static async getChaptersByBook(req, res) {
    try {
      const { bookId } = req.params;
      const chapters = await Chapter.findByBookId(bookId);
      res.json(chapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getChapter(req, res) {
    try {
      const { chapterId } = req.params;
      const chapter = await Chapter.findById(chapterId);

      if (!chapter) {
        return res.status(404).json({ error: 'Capítulo no encontrado' });
      }

      res.json(chapter);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getChapterByNumber(req, res) {
    try {
      const { bookId, chapterNumber } = req.params;
      const chapter = await Chapter.findByBookAndChapter(bookId, chapterNumber);

      if (!chapter) {
        return res.status(404).json({ error: 'Capítulo no encontrado' });
      }

      res.json(chapter);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createChapter(req, res) {
    try {
      const { bookId } = req.params;
      const { title, chapterNumber, content } = req.body;

      if (!title || chapterNumber === undefined) {
        return res.status(400).json({ error: 'Título y número de capítulo son requeridos' });
      }

      const chapter = await Chapter.create(bookId, title, chapterNumber, content);
      res.status(201).json(chapter);
    } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateChapter(req, res) {
    try {
      const { chapterId } = req.params;
      const { title, content } = req.body;

      const chapter = await Chapter.update(chapterId, title, content);

      if (!chapter) {
        return res.status(404).json({ error: 'Capítulo no encontrado' });
      }

      res.json(chapter);
    } catch (error) {
      console.error('Error updating chapter:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteChapter(req, res) {
    try {
      const { chapterId } = req.params;
      const result = await Chapter.delete(chapterId);

      if (!result) {
        return res.status(404).json({ error: 'Capítulo no encontrado' });
      }

      res.json({ message: 'Capítulo eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ChapterController;
