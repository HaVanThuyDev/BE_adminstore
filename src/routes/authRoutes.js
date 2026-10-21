const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../validations');
const { authenticate } = require('../middlewares');

router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getProfile(req, res, next));

module.exports = router;
