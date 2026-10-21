const express = require('express');
const router = express.Router();
const dataSourceController = require('../controllers/dataSourceController');
const uploadMiddleware = require('../middlewares/upload');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Upload ảnh: Lưu ID số vào bảng data_souses và đẩy Stream lên Cloudinary
router.post(
  '/upload',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  uploadMiddleware.single('file'),
  (req, res, next) => dataSourceController.upload(req, res, next)
);

// Lấy danh sách ảnh & media trong bảng data_souses
router.get('/', authenticate, (req, res, next) =>
  dataSourceController.getAll(req, res, next)
);

// Chi tiết 1 bản ghi theo ID
router.get('/:id', (req, res, next) =>
  dataSourceController.getById(req, res, next)
);

// Xóa bản ghi
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  dataSourceController.delete(req, res, next)
);

module.exports = router;
