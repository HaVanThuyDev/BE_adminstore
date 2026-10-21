const dataSourceService = require('../services/dataSourceService');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class DataSourceController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'Vui lòng chọn tệp tin hình ảnh để tải lên', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await dataSourceService.uploadAndSaveDataSource(req.file);
      return ApiResponse.success(
        res,
        result,
        'Tải ảnh lên và lưu vào data_souses thành công',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await dataSourceService.getAllDataSources(req.query);
      return ApiResponse.success(res, data, 'Lấy danh sách data_souses thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await dataSourceService.getDataSourceById(req.params.id);
      return ApiResponse.success(res, data);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async delete(req, res, next) {
    try {
      await dataSourceService.deleteDataSource(req.params.id);
      return ApiResponse.success(res, null, 'Đã xóa dữ liệu data_souses thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

module.exports = new DataSourceController();
