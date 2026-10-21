const { getOne, query } = require('../config/database');

class ConsultationRepository {
  async findAll() {
    return query('SELECT * FROM CONSULTATIONS ORDER BY CREATED_AT DESC');
  }

  async findById(id) {
    return getOne('SELECT * FROM CONSULTATIONS WHERE ID = ?', [id]);
  }

  async create(lead) {
    const { id, fullName, phone, email, company, serviceInterest, estimatedBudget, message } = lead;
    await query(
      `INSERT INTO CONSULTATIONS (ID, FULL_NAME, PHONE, EMAIL, COMPANY, SERVICE_INTEREST, ESTIMATED_BUDGET, MESSAGE)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, fullName, phone, email || '', company || '', serviceInterest || 'Tư vấn phần mềm', estimatedBudget || 'Chưa rõ', message || '']
    );
    return this.findById(id);
  }

  async updateStatus(id, status) {
    await query('UPDATE CONSULTATIONS SET STATUS = ? WHERE ID = ?', [status, id]);
    return this.findById(id);
  }
}

module.exports = new ConsultationRepository();
