const app = require('./app');
const config = require('./config/env');
const { ensureDatabaseExists } = require('./config/database');
const { initMySQLTables } = require('./models/schema');
const { seedData } = require('./models/seed');

const startServer = async () => {
  try {
    console.log('⏳ [Server] Đang kết nối MySQL Database...');
    // 1. Đảm bảo Database tồn tại
    await ensureDatabaseExists();

    // 2. Khởi tạo các bảng MySQL
    await initMySQLTables();

    // 3. Nạp dữ liệu mẫu ban đầu (Seeder)
    await seedData();

    // 4. Lắng nghe Port
    app.listen(config.port, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 2HT Technology Backend Server (MySQL) is Running!`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`📋 API Docs & Endpoints: http://localhost:${config.port}/api/v1`);
      console.log(`🔑 Super Admin Login: admin@2ht.vn / Password@2026`);
      console.log(`💾 Database: ${config.db.host}:${config.db.port}/${config.db.database}`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('\n❌ [Server Error] Không thể kết nối hoặc khởi tạo MySQL Database:');
    console.error('Chi tiết lỗi:', error.message);
    console.error('\n👉 Vui lòng kiểm tra file .env:');
    console.error(`- DB_HOST: ${config.db.host}`);
    console.error(`- DB_PORT: ${config.db.port}`);
    console.error(`- DB_USER: ${config.db.user}`);
    console.error(`- DB_PASSWORD: (mật khẩu MySQL của bạn)`);
    console.error(`- DB_NAME: ${config.db.database}\n`);
    process.exit(1);
  }
};

startServer();
