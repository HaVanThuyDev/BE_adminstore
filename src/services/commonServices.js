const orderRepository = require('../repositories/orderRepository');
const consultationRepository = require('../repositories/consultationRepository');
const settingRepository = require('../repositories/settingRepository');

class OrderService {
  async checkout(data) {
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerCompany: data.customerCompany || '',
      total: Number(data.total) || 0,
      paymentMethod: data.paymentMethod || 'VIETQR',
      notes: data.notes || '',
    };
    return orderRepository.create(order);
  }

  async getAllOrders() {
    return orderRepository.findAll();
  }

  async updateOrderStatus(id, data) {
    return orderRepository.updateStatus(id, data);
  }
}

class ConsultationService {
  async submitConsultation(data) {
    const lead = {
      id: `cs-${Date.now()}`,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || '',
      company: data.company || '',
      serviceInterest: data.serviceInterest || 'Tư vấn phần mềm',
      estimatedBudget: data.estimatedBudget || 'Chưa rõ',
      message: data.message || '',
    };
    return consultationRepository.create(lead);
  }

  async getAllConsultations() {
    return consultationRepository.findAll();
  }

  async updateStatus(id, status) {
    return consultationRepository.updateStatus(id, status);
  }
}

class SettingService {
  async getSettings() {
    const settings = await settingRepository.getSettings();
    if (!settings) return null;
    return {
      ...settings,
      socialLinks: JSON.parse(settings.socialLinks || '{}'),
    };
  }

  async updateSettings(data) {
    const current = await settingRepository.getSettings();
    const socialLinks = data.socialLinks ? JSON.stringify(data.socialLinks) : current.socialLinks;

    const payload = {
      brandName: data.brandName || current.brandName,
      brandSubname: data.brandSubname || current.brandSubname,
      slogan: data.slogan !== undefined ? data.slogan : current.slogan,
      mainMessage: data.mainMessage !== undefined ? data.mainMessage : current.mainMessage,
      contactEmail: data.contactEmail || current.contactEmail,
      supportEmail: data.supportEmail !== undefined ? data.supportEmail : current.supportEmail,
      hotline: data.hotline || current.hotline,
      address: data.address || current.address,
      workingHours: data.workingHours || current.workingHours,
      socialLinks,
      copyrightText: data.copyrightText || current.copyrightText,
    };

    const updated = await settingRepository.updateSettings(payload);
    return {
      ...updated,
      socialLinks: JSON.parse(updated.socialLinks || '{}'),
    };
  }

  async getDashboardStats() {
    return settingRepository.getDashboardStats();
  }
}

module.exports = {
  orderService: new OrderService(),
  consultationService: new ConsultationService(),
  settingService: new SettingService(),
};
