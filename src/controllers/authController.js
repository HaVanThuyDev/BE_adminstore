const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(res, result, 'Đăng nhập thành công', HTTP_STATUS.OK);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return ApiResponse.success(res, user, 'Lấy thông tin tài khoản thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

module.exports = new AuthController();
