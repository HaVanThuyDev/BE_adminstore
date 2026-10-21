const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.post('/', (req, res, next) => consultationController.submit(req, res, next));

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  consultationController.getAll(req, res, next)
);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  consultationController.updateStatus(req, res, next)
);

module.exports = router;
