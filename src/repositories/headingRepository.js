const { getOne, query } = require('../config/database');

class HeadingRepository {
  async findAll({ page, section } = {}) {
    let sql = 'SELECT * FROM SITE_HEADINGS WHERE 1=1';
    const params = [];

    if (page) {
      sql += ' AND PAGE = ?';
      params.push(page);
    }
    if (section) {
      sql += ' AND SECTION = ?';
      params.push(section);
    }

    sql += ' ORDER BY PAGE ASC, SECTION ASC, ID ASC';
    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM SITE_HEADINGS WHERE ID = ?', [id]);
  }

  async findByKey(key) {
    return getOne('SELECT * FROM SITE_HEADINGS WHERE `KEY` = ?', [key]);
  }

  async create(heading) {
    const { id, key, section, label, value, type, page } = heading;
    await query(
      `INSERT INTO SITE_HEADINGS (ID, \`KEY\`, SECTION, LABEL, VALUE, TYPE, PAGE)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, key, section, label, value, type, page]
    );
    return this.findById(id);
  }

  async updateValue(id, value) {
    await query('UPDATE SITE_HEADINGS SET VALUE = ? WHERE ID = ?', [value, id]);
    return this.findById(id);
  }

  async update(id, heading) {
    const { key, section, label, value, type, page } = heading;
    await query(
      `UPDATE SITE_HEADINGS SET
        \`KEY\` = ?, SECTION = ?, LABEL = ?, VALUE = ?, TYPE = ?, PAGE = ?
       WHERE ID = ?`,
      [key, section, label, value, type, page, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    const res = await query('DELETE FROM SITE_HEADINGS WHERE ID = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new HeadingRepository();
