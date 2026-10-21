const { consultationService } = require('../services/commonServices');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class ConsultationController {
  async submit(req, res, next) {
    try {
      const lead = await consultationService.submitConsultation(req.body);
      return ApiResponse.success(res, lead, 'Gửi yêu cầu tư vấn thành công', HTTP_STATUS.CREATED);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getAll(req, res, next) {
    try {
      const leads = await consultationService.getAllConsultations();
      return ApiResponse.success(res, leads, 'Lấy danh sách yêu cầu tư vấn thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await consultationService.updateStatus(req.params.id, req.body.status);
      return ApiResponse.success(res, updated, 'Cập nhật trạng thái lead thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

module.exports = new ConsultationController();
