const { getOne, query } = require('../config/database');

class SettingRepository {
  async getSettings() {
    return getOne('SELECT * FROM site_settings WHERE id = 1');
  }

  async updateSettings(settings) {
    const {
      brandName,
      brandSubname,
      slogan,
      mainMessage,
      contactEmail,
      supportEmail,
      hotline,
      address,
      workingHours,
      socialLinks,
      copyrightText,
    } = settings;

    await query(
      `UPDATE site_settings SET
        brandName = ?, brandSubname = ?, slogan = ?, mainMessage = ?,
        contactEmail = ?, supportEmail = ?, hotline = ?, address = ?,
        workingHours = ?, socialLinks = ?, copyrightText = ?
       WHERE id = 1`,
      [
        brandName,
        brandSubname,
        slogan,
        mainMessage,
        contactEmail,
        supportEmail,
        hotline,
        address,
        workingHours,
        socialLinks,
        copyrightText,
      ]
    );

    return this.getSettings();
  }

  async getDashboardStats() {
    const totalOrdersRow = await getOne(
      "SELECT SUM(total) as revenue, COUNT(id) as count FROM orders WHERE status != 'DEMO_CANCELLED'"
    );
    const pendingOrdersRow = await getOne(
      "SELECT COUNT(id) as count FROM orders WHERE status = 'DEMO_PENDING'"
    );
    const totalProductsRow = await getOne('SELECT COUNT(id) as count FROM products');
    const newConsultationsRow = await getOne(
      "SELECT COUNT(id) as count FROM consultations WHERE status = 'NEW'"
    );

    return {
      totalRevenue: totalOrdersRow?.revenue || 0,
      totalOrders: totalOrdersRow?.count || 0,
      pendingOrders: pendingOrdersRow?.count || 0,
      totalProducts: totalProductsRow?.count || 0,
      newConsultations: newConsultationsRow?.count || 0,
    };
  }
}

module.exports = new SettingRepository();
