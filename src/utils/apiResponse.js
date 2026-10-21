const { HTTP_STATUS } = require('../constants');

class ApiResponse {
  static success(res, data = null, message = 'Thành công', statusCode = HTTP_STATUS.OK, meta = null) {
    const payload = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static error(res, message = 'Đã có lỗi xảy ra', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null, errorCode = null) {
    const payload = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    if (errors) payload.errors = errors;
    if (errorCode) payload.errorCode = errorCode;
    return res.status(statusCode).json(payload);
  }
}

module.exports = ApiResponse;
