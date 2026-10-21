const { getOne, query } = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    return getOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  async findById(id) {
    return getOne(
      'SELECT id, email, fullName, phone, role, status, avatarUrl, createdAt FROM users WHERE id = ?',
      [id]
    );
  }

  async create(user) {
    const { id, email, password, fullName, phone, role, status, avatarUrl } = user;
    await query(
      `INSERT INTO users (id, email, password, fullName, phone, role, status, avatarUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, email, password, fullName, phone, role || 'CUSTOMER', status || 'ACTIVE', avatarUrl || null]
    );
    return this.findById(id);
  }
}

module.exports = new UserRepository();
