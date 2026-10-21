const { getOne, query } = require('../config/database');

class OrderRepository {
  async findAll() {
    return query('SELECT * FROM ORDERS ORDER BY CREATED_AT DESC');
  }

  async findById(id) {
    return getOne('SELECT * FROM ORDERS WHERE ID = ?', [id]);
  }

  async create(order) {
    const { id, customerName, customerEmail, customerPhone, customerCompany, total, paymentMethod, notes } = order;
    await query(
      `INSERT INTO ORDERS (ID, CUSTOMER_NAME, CUSTOMER_EMAIL, CUSTOMER_PHONE, CUSTOMER_COMPANY, TOTAL, PAYMENT_METHOD, NOTES)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customerName, customerEmail, customerPhone, customerCompany || '', total, paymentMethod || 'VIETQR', notes || '']
    );
    return this.findById(id);
  }

  async updateStatus(id, { status, paymentStatus }) {
    await query(
      `UPDATE ORDERS SET
        STATUS = COALESCE(?, STATUS),
        PAYMENT_STATUS = COALESCE(?, PAYMENT_STATUS)
       WHERE ID = ?`,
      [status, paymentStatus, id]
    );
    return this.findById(id);
  }
}

module.exports = new OrderRepository();
