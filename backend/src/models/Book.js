const pool = require('../database/db');

class Book {
  static async findAll() {
    const result = await pool.query(`
      SELECT b.*, COUNT(c.id) as chapter_count
      FROM books b
      LEFT JOIN chapters c ON b.id = c.book_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT b.*, COUNT(c.id) as chapter_count
      FROM books b
      LEFT JOIN chapters c ON b.id = c.book_id
      WHERE b.id = $1
      GROUP BY b.id
    `, [id]);
    return result.rows[0];
  }

  static async create(title, author, description, coverUrl, filePath) {
    const result = await pool.query(`
      INSERT INTO books (title, author, description, cover_url, file_path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, author, description, coverUrl, filePath]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id);
    const query = `UPDATE books SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Book;
