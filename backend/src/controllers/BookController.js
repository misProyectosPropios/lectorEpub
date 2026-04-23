const Book = require('../models/Book');

class BookController {
  static async getAllBooks(req, res) {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createBook(req, res) {
    try {
      console.log("Llegado a create book")
      const { title, author, description, coverUrl, filePath } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'El título es requerido' });
      }

      const book = await Book.create(title, author, description, coverUrl, filePath);
      res.status(201).json(book);
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, description, coverUrl, filePath } = req.body;

      const updates = {};
      if (title) updates.title = title;
      if (author !== undefined) updates.author = author;
      if (description !== undefined) updates.description = description;
      if (coverUrl !== undefined) updates.cover_url = coverUrl;
      if (filePath !== undefined) updates.file_path = filePath;

      const book = await Book.update(id, updates);

      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json(book);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const result = await Book.delete(id);

      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BookController;
