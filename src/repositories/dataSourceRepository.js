const { getOne, query } = require('../config/database');

class DataSourceRepository {
  async createPending({ fileName, originalName, mimeType, fileSize }) {
    const [result] = await query(
      `INSERT INTO data_souses (fileName, originalName, mimeType, fileSize, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [fileName, originalName, mimeType, fileSize]
    );
    return this.findById(result.insertId);
  }

  async updateCloudinaryResult(id, { cloudinaryUrl, publicId, status = 'COMPLETED' }) {
    await query(
      `UPDATE data_souses SET cloudinaryUrl = ?, publicId = ?, status = ? WHERE id = ?`,
      [cloudinaryUrl, publicId, status, id]
    );
    return this.findById(id);
  }

  async findById(id) {
    return getOne('SELECT * FROM data_souses WHERE id = ?', [id]);
  }

  async findAll({ limit = 50, offset = 0 } = {}) {
    return query(
      'SELECT * FROM data_souses ORDER BY createdAt DESC LIMIT ? OFFSET ?',
      [Number(limit), Number(offset)]
    );
  }

  async delete(id) {
    const res = await query('DELETE FROM data_souses WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new DataSourceRepository();
