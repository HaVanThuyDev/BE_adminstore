const headingService = require('../services/headingService');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class HeadingController {
  async getAll(req, res, next) {
    try {
      const data = await headingService.getAllHeadings(req.query);
      return ApiResponse.success(res, data, 'Lấy danh sách tiêu đề thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await headingService.getHeadingById(req.params.id);
      return ApiResponse.success(res, data);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async create(req, res, next) {
    try {
      const created = await headingService.createHeading(req.body);
      return ApiResponse.success(res, created, 'Thêm mới tiêu đề thành công', HTTP_STATUS.CREATED);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async updateValue(req, res, next) {
    try {
      const updated = await headingService.updateHeadingValue(req.params.id, req.body.value);
      return ApiResponse.success(res, updated, 'Cập nhật tiêu đề thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await headingService.updateHeading(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Cập nhật tiêu đề chi tiết thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async delete(req, res, next) {
    try {
      await headingService.deleteHeading(req.params.id);
      return ApiResponse.success(res, null, 'Đã xóa tiêu đề thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

module.exports = new HeadingController();
