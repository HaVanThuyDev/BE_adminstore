const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { validateBlog } = require('../validations');
const { authenticate, authorize } = require('../middlewares');
const { ROLES } = require('../constants');

// Public
router.get('/', (req, res, next) => blogController.getAll(req, res, next));
router.get('/:slug', (req, res, next) => blogController.getBySlug(req, res, next));

// Admin
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateBlog, (req, res, next) =>
  blogController.create(req, res, next)
);
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), validateBlog, (req, res, next) =>
  blogController.update(req, res, next)
);
router.patch('/:id/toggle-featured', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  blogController.toggleFeatured(req, res, next)
);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res, next) =>
  blogController.delete(req, res, next)
);

module.exports = router;
