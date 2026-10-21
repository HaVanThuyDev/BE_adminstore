const { HTTP_STATUS, ROLES } = require('../constants');
const { verifyToken } = require('../utils/helpers');
const ApiResponse = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Vui lòng đăng nhập để tiếp tục', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn', HTTP_STATUS.FORBIDDEN);
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Bạn không có quyền thực hiện thao tác này', HTTP_STATUS.FORBIDDEN);
    }
    next();
  };
};

const errorHandler = (err, req, res, next) => {
  console.error(`❌ [Error] ${req.method} ${req.url} ->`, err);
  return ApiResponse.error(res, err.message || 'Lỗi xử lý máy chủ nội bộ', HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

module.exports = {
  authenticate,
  authorize,
  errorHandler,
};
