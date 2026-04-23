const fs = require('fs').promises;
const path = require('path');
const Book = require('../models/Book');

class BookController {
  static async getAllBooks(req, res) {
    try {
      logInfo("Llegado a get all books")
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
      logInfo("Llegado a get book by id")
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
      
      if (!book.file_path) {
        return res.status(404).json({ error: 'El archivo del libro no está disponible' });
      }

      res.sendFile(path.resolve(book.file_path));
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookByName(req, res) {
    try {
      const { name } = req.params;
      logInfo("Buscando libro en sistema de archivos: " + name);

      const booksDir = path.resolve('books');
      const files = await fs.readdir(booksDir);
      logInfo("Archivos detectados en la carpeta books: " + files.join(', '));

      // Buscamos un archivo que coincida con el nombre (ignorando la extensión)
      const matchedFile = files.find(f => {
        const fileBaseName = path.parse(f).name.toLowerCase();
        return fileBaseName === name.toLowerCase() || f.toLowerCase() === name.toLowerCase();
      });

      if (!matchedFile) {
        logInfo("Archivo no encontrado para: " + name);
        return res.status(404).json({ error: 'Libro no encontrado en el sistema de archivos' });
      }

      res.sendFile(path.join(booksDir, matchedFile));
    } catch (error) {
      console.error('Error fetching book by name:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createBook(req, res) {
    try {
      logInfo("Llegado a create book")

      if (!req.file) {
        logInfo("No file found");
        return res.status(400).json({ error: 'El archivo del libro (campo "book") es requerido' });
      }

      const targetPath = path.join('books', req.file.originalname);
      await fs.rename(req.file.path, targetPath);
      logInfo(`Archivo movido a: ${targetPath}`);
      
      // Guardamos en la base de datos usando el nombre original y la nueva ruta
      const book = await Book.create(req.file.originalname, null, null, null, targetPath);
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


function logInfo(message) {
  console.log(message)
}