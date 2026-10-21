const headingRepository = require('../repositories/headingRepository');

class HeadingService {
  async getAllHeadings(query = {}) {
    const headings = await headingRepository.findAll(query);

    if (query.asMap === 'true') {
      const map = {};
      headings.forEach((h) => {
        map[h.key] = h.value;
      });
      return map;
    }

    return headings;
  }

  async getHeadingById(id) {
    const heading = await headingRepository.findById(id);
    if (!heading) {
      throw new Error('Không tìm thấy tiêu đề');
    }
    return heading;
  }

  async createHeading(data) {
    const existing = await headingRepository.findByKey(data.key);
    if (existing) {
      throw new Error(`Key định danh "${data.key}" đã tồn tại`);
    }

    const newHeading = {
      id: `heading-${Date.now()}`,
      key: data.key,
      section: data.section || 'Chung',
      label: data.label || data.key,
      value: data.value,
      type: data.type || 'heading',
      page: data.page || 'Trang chủ',
    };

    return headingRepository.create(newHeading);
  }

  async updateHeadingValue(id, value) {
    const heading = await headingRepository.findById(id);
    if (!heading) {
      throw new Error('Không tìm thấy tiêu đề để cập nhật');
    }
    return headingRepository.updateValue(id, value);
  }

  async updateHeading(id, data) {
    const heading = await headingRepository.findById(id);
    if (!heading) {
      throw new Error('Không tìm thấy tiêu đề để cập nhật');
    }
    return headingRepository.update(id, data);
  }

  async deleteHeading(id) {
    const success = await headingRepository.delete(id);
    if (!success) {
      throw new Error('Không tìm thấy tiêu đề để xóa');
    }
    return true;
  }
}

module.exports = new HeadingService();
