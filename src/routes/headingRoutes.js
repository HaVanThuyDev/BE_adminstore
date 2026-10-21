const express = require('express');
const router = express.Router();
const headingController = require('../controllers/headingController');
const { validateHeading } = require('../validations');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.get('/', (req, res, next) => headingController.getAll(req, res, next));
router.get('/:id', (req, res, next) => headingController.getById(req, res, next));

// Admin
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateHeading, (req, res, next) =>
  headingController.create(req, res, next)
);
router.patch('/:id/value', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  headingController.updateValue(req, res, next)
);
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateHeading, (req, res, next) =>
  headingController.update(req, res, next)
);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  headingController.delete(req, res, next)
);

module.exports = router;
