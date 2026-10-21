const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../validations');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:slug', (req, res, next) => productController.getBySlug(req, res, next));

// Admin
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateProduct, (req, res, next) =>
  productController.create(req, res, next)
);
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateProduct, (req, res, next) =>
  productController.update(req, res, next)
);
router.patch('/:id/toggle-publish', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  productController.togglePublish(req, res, next)
);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  productController.delete(req, res, next)
);

module.exports = router;
