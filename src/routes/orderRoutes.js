const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.post('/checkout', (req, res, next) => orderController.checkout(req, res, next));

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  orderController.getAll(req, res, next)
);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  orderController.updateStatus(req, res, next)
);

module.exports = router;
