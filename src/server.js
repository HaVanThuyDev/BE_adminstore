const cluster = require('cluster');
const os = require('os');
const app = require('./app');
const config = require('./config/env');
const { ensureDatabaseExists } = require('./config/database');
const { initMySQLTables } = require('./models/schema');
const { seedData } = require('./models/seed');

const numCPUs = os.cpus().length;
const totalWorkers = config.cluster.workers > 0 ? config.cluster.workers : numCPUs;

// Khởi chạy hệ thống tận dụng đa nhân (Multi-Core Cluster)
if (config.cluster.enabled && cluster.isPrimary) {
  console.log(`\n======================================================`);
  console.log(`👑 [Cluster Primary] Tiến trình chính đang chạy (PID: ${process.pid})`);
  console.log(`⚡ [Multi-Core] Hệ thống phát hiện ${numCPUs} nhân CPU. Đang fork ${totalWorkers} workers...`);
  console.log(`======================================================\n`);

  // Chạy database migration & seed trước khi spawn các worker
  (async () => {
    try {
      console.log('⏳ [Cluster Primary] Chuẩn bị cơ sở dữ liệu MySQL...');
      await ensureDatabaseExists();
      await initMySQLTables();
      await seedData();
      console.log('✅ [Cluster Primary] Database đã sẵn sàng! Bắt đầu phân phối workers.');

      // Fork các Worker process trên từng CPU Core
      for (let i = 0; i < totalWorkers; i++) {
        cluster.fork();
      }

      // Tự động hồi phục (Self-healing) nếu 1 worker bị crash
      cluster.on('exit', (worker, code, signal) => {
        console.warn(`⚠️ [Cluster Warning] Worker ${worker.process.pid} đã dừng (Code: ${code}, Signal: ${signal}). Đang khởi tạo worker mới thay thế...`);
        cluster.fork();
      });
    } catch (err) {
      console.error('❌ [Cluster Error] Lỗi khởi tạo Database tại Primary process:', err.message);
      process.exit(1);
    }
  })();

} else {
  // Worker process hoặc Single-process mode
  const startWorkerServer = async () => {
    try {
      // Nếu không bật cluster, tự khởi tạo DB ở process đơn
      if (!config.cluster.enabled) {
        await ensureDatabaseExists();
        await initMySQLTables();
        await seedData();
      }

      app.listen(config.port, () => {
        const mode = config.cluster.enabled ? `Worker PID: ${process.pid}` : `Single Process PID: ${process.pid}`;
        console.log(`🚀 [Server Ready] ${mode} đang lắng nghe tại: http://localhost:${config.port}`);
      });
    } catch (error) {
      console.error(`❌ [Worker Error - PID: ${process.pid}]:`, error.message);
      process.exit(1);
    }
  };

  startWorkerServer();
}
