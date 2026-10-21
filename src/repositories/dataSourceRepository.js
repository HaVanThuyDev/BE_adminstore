const { getOne, query } = require('../config/database');

class DataSourceRepository {
  async createPending({ fileName, originalName, mimeType, fileSize }) {
    const result = await query(
      `INSERT INTO DATA_SOUSES (FILE_NAME, ORIGINAL_NAME, MIME_TYPE, FILE_SIZE, STATUS)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [fileName, originalName, mimeType, fileSize]
    );
    return this.findById(result.insertId);
  }

  async updateCloudinaryResult(id, { cloudinaryUrl, publicId, status = 'COMPLETED' }) {
    await query(
      `UPDATE DATA_SOUSES SET CLOUDINARY_URL = ?, PUBLIC_ID = ?, STATUS = ? WHERE ID = ?`,
      [cloudinaryUrl, publicId, status, id]
    );
    return this.findById(id);
  }

  async findById(id) {
    return getOne('SELECT * FROM DATA_SOUSES WHERE ID = ?', [id]);
  }

  async findAll({ limit = 50, offset = 0 } = {}) {
    return query(
      'SELECT * FROM DATA_SOUSES ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?',
      [Number(limit), Number(offset)]
    );
  }

  async delete(id) {
    const res = await query('DELETE FROM DATA_SOUSES WHERE ID = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new DataSourceRepository();
