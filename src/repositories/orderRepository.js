const { getOne, query } = require('../config/database');

class OrderRepository {
  async findAll() {
    return query('SELECT * FROM orders ORDER BY createdAt DESC');
  }

  async findById(id) {
    return getOne('SELECT * FROM orders WHERE id = ?', [id]);
  }

  async create(order) {
    const { id, customerName, customerEmail, customerPhone, customerCompany, total, paymentMethod, notes } = order;
    await query(
      `INSERT INTO orders (id, customerName, customerEmail, customerPhone, customerCompany, total, paymentMethod, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customerName, customerEmail, customerPhone, customerCompany || '', total, paymentMethod || 'VIETQR', notes || '']
    );
    return this.findById(id);
  }

  async updateStatus(id, { status, paymentStatus }) {
    await query(
      `UPDATE orders SET
        status = COALESCE(?, status),
        paymentStatus = COALESCE(?, paymentStatus)
       WHERE id = ?`,
      [status, paymentStatus, id]
    );
    return this.findById(id);
  }
}

module.exports = new OrderRepository();
