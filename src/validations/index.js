const { HTTP_STATUS } = require('../constants');
const ApiResponse = require('../utils/apiResponse');

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email không được để trống' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Email không đúng định dạng' });
  }

  if (!password || !password.trim()) {
    errors.push({ field: 'password', message: 'Mật khẩu không được để trống' });
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', HTTP_STATUS.BAD_REQUEST, errors);
  }

  next();
};

const validateHeading = (req, res, next) => {
  const { key, value } = req.body;
  const errors = [];

  if (!key || !key.trim()) {
    errors.push({ field: 'key', message: 'Key định danh không được để trống' });
  }
  if (!value || !value.trim()) {
    errors.push({ field: 'value', message: 'Nội dung tiêu đề không được để trống' });
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', HTTP_STATUS.BAD_REQUEST, errors);
  }

  next();
};

const validateBlog = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  if (!title || !title.trim()) {
    errors.push({ field: 'title', message: 'Tiêu đề bài viết không được để trống' });
  }
  if (!content || !content.trim()) {
    errors.push({ field: 'content', message: 'Nội dung bài viết không được để trống' });
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', HTTP_STATUS.BAD_REQUEST, errors);
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push({ field: 'name', message: 'Tên sản phẩm không được để trống' });
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Dữ liệu không hợp lệ', HTTP_STATUS.BAD_REQUEST, errors);
  }

  next();
};

module.exports = {
  validateLogin,
  validateHeading,
  validateBlog,
  validateProduct,
};
