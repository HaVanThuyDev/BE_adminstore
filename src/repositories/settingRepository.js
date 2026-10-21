const { getOne, query } = require('../config/database');

class SettingRepository {
  async getSettings() {
    return getOne('SELECT * FROM SITE_SETTINGS WHERE ID = 1');
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
      `UPDATE SITE_SETTINGS SET
        BRAND_NAME = ?, BRAND_SUBNAME = ?, SLOGAN = ?, MAIN_MESSAGE = ?,
        CONTACT_EMAIL = ?, SUPPORT_EMAIL = ?, HOTLINE = ?, ADDRESS = ?,
        WORKING_HOURS = ?, SOCIAL_LINKS = ?, COPYRIGHT_TEXT = ?
       WHERE ID = 1`,
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
      "SELECT SUM(TOTAL) as revenue, COUNT(ID) as count FROM ORDERS WHERE STATUS != 'DEMO_CANCELLED'"
    );
    const pendingOrdersRow = await getOne(
      "SELECT COUNT(ID) as count FROM ORDERS WHERE STATUS = 'DEMO_PENDING'"
    );
    const totalProductsRow = await getOne('SELECT COUNT(ID) as count FROM PRODUCTS');
    const newConsultationsRow = await getOne(
      "SELECT COUNT(ID) as count FROM CONSULTATIONS WHERE STATUS = 'NEW'"
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
