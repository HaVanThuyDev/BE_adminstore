const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.get('/', (req, res, next) => settingController.getSettings(req, res, next));

// Admin
router.put('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  settingController.updateSettings(req, res, next)
);
router.get('/dashboard/stats', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  settingController.getDashboardStats(req, res, next)
);

module.exports = router;
