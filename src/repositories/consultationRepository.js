const { getOne, query } = require('../config/database');

class ConsultationRepository {
  async findAll() {
    return query('SELECT * FROM consultations ORDER BY createdAt DESC');
  }

  async findById(id) {
    return getOne('SELECT * FROM consultations WHERE id = ?', [id]);
  }

  async create(lead) {
    const { id, fullName, phone, email, company, serviceInterest, estimatedBudget, message } = lead;
    await query(
      `INSERT INTO consultations (id, fullName, phone, email, company, serviceInterest, estimatedBudget, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, fullName, phone, email || '', company || '', serviceInterest || 'Tư vấn phần mềm', estimatedBudget || 'Chưa rõ', message || '']
    );
    return this.findById(id);
  }

  async updateStatus(id, status) {
    await query('UPDATE consultations SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
}

module.exports = new ConsultationRepository();
