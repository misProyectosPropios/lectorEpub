const pool = require('../database/db');

class Chapter {
  static async findByBookId(bookId) {
    const result = await pool.query(`
      SELECT * FROM chapters
      WHERE book_id = $1
      ORDER BY chapter_number ASC
    `, [bookId]);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM chapters WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByBookAndChapter(bookId, chapterNumber) {
    const result = await pool.query(`
      SELECT * FROM chapters
      WHERE book_id = $1 AND chapter_number = $2
    `, [bookId, chapterNumber]);
    return result.rows[0];
  }

  static async create(bookId, title, chapterNumber, content) {
    const result = await pool.query(`
      INSERT INTO chapters (book_id, title, chapter_number, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [bookId, title, chapterNumber, content]);
    return result.rows[0];
  }

  static async update(id, title, content) {
    const result = await pool.query(`
      UPDATE chapters
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING *
    `, [title, content, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM chapters WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async deleteByBookId(bookId) {
    const result = await pool.query('DELETE FROM chapters WHERE book_id = $1', [bookId]);
    return result.rowCount;
  }
}

module.exports = Chapter;
