const { getOne, query } = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    return getOne('SELECT * FROM USERS WHERE EMAIL = ?', [email]);
  }

  async findById(id) {
    return getOne(
      'SELECT ID, EMAIL, FULL_NAME, PHONE, ROLE, STATUS, AVATAR_URL, CREATED_AT FROM USERS WHERE ID = ?',
      [id]
    );
  }

  async create(user) {
    const { id, email, password, fullName, phone, role, status, avatarUrl } = user;
    await query(
      `INSERT INTO USERS (ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ROLE, STATUS, AVATAR_URL)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, email, password, fullName, phone, role || 'CUSTOMER', status || 'ACTIVE', avatarUrl || null]
    );
    return this.findById(id);
  }
}

module.exports = new UserRepository();
