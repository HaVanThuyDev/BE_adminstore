const multer = require('multer');

// Sử dụng MemoryStorage để tạo buffer cho Stream và Worker Thread
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Chỉ cho phép upload file ảnh hoặc tài liệu phổ biến
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng tệp không được hỗ trợ. Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF, SVG.'), false);
  }
};

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Tối đa 10MB
  },
  fileFilter,
});

module.exports = uploadMiddleware;
