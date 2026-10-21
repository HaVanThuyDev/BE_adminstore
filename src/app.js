const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middlewares');

const app = express();

// Middlewares chung
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root API Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 2HT Technology Backend REST API (MySQL) is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      headings: '/api/v1/headings',
      blogs: '/api/v1/blogs',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      consultations: '/api/v1/consultations',
      settings: '/api/v1/settings',
    },
  });
});

// Đăng ký API Routes v1
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.method} ${req.url}`,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
