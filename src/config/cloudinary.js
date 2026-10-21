const cloudinary = require('cloudinary').v2;
const config = require('./env');

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
  console.log('☁️ [Cloudinary] Đã cấu hình Cloudinary SDK thành công!');
} else {
  console.log('⚠️ [Cloudinary] Chưa cấu hình đầy đủ API Key trong .env, sẽ dùng chế độ lưu trữ mô phỏng/fallback');
}

module.exports = cloudinary;
