const { settingService } = require('../services/commonServices');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class SettingController {
  async getSettings(req, res, next) {
    try {
      const data = await settingService.getSettings();
      return ApiResponse.success(res, data, 'Lấy cấu hình thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const updated = await settingService.updateSettings(req.body);
      return ApiResponse.success(res, updated, 'Cập nhật cấu hình thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const stats = await settingService.getDashboardStats();
      return ApiResponse.success(res, stats, 'Lấy dữ liệu Dashboard thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }
}

module.exports = new SettingController();
