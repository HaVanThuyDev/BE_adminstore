const { getOne, query } = require('../config/database');

class HeadingRepository {
  async findAll({ page, section } = {}) {
    let sql = 'SELECT * FROM site_headings WHERE 1=1';
    const params = [];

    if (page) {
      sql += ' AND page = ?';
      params.push(page);
    }
    if (section) {
      sql += ' AND section = ?';
      params.push(section);
    }

    sql += ' ORDER BY page ASC, section ASC, id ASC';
    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM site_headings WHERE id = ?', [id]);
  }

  async findByKey(key) {
    return getOne('SELECT * FROM site_headings WHERE `key` = ?', [key]);
  }

  async create(heading) {
    const { id, key, section, label, value, type, page } = heading;
    await query(
      `INSERT INTO site_headings (id, \`key\`, section, label, value, type, page)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, key, section, label, value, type, page]
    );
    return this.findById(id);
  }

  async updateValue(id, value) {
    await query('UPDATE site_headings SET value = ? WHERE id = ?', [value, id]);
    return this.findById(id);
  }

  async update(id, heading) {
    const { key, section, label, value, type, page } = heading;
    await query(
      `UPDATE site_headings SET
        \`key\` = ?, section = ?, label = ?, value = ?, type = ?, page = ?
       WHERE id = ?`,
      [key, section, label, value, type, page, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    const res = await query('DELETE FROM site_headings WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new HeadingRepository();
