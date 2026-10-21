const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const headingRoutes = require('./headingRoutes');
const blogRoutes = require('./blogRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const consultationRoutes = require('./consultationRoutes');
const settingRoutes = require('./settingRoutes');
const dataSourceRoutes = require('./dataSourceRoutes');

// Gắn các phân hệ routes
router.use('/auth', authRoutes);
router.use('/headings', headingRoutes);
router.use('/blogs', blogRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/consultations', consultationRoutes);
router.use('/settings', settingRoutes);
router.use('/data-sources', dataSourceRoutes);

module.exports = router;
