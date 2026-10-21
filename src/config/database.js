const mysql = require('mysql2/promise');
const config = require('./env');

let pool = null;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
};

// Tạo Database nếu chưa tồn tại
const ensureDatabaseExists = async () => {
  const rootConn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
  });

  await rootConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await rootConn.end();
  console.log(`✅ [Database] Đã xác nhận Database "${config.db.database}"`);
};

// Query thực thi câu lệnh SQL có tham số
const query = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  return rows;
};

// Lấy 1 bản ghi duy nhất
const getOne = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  getPool,
  ensureDatabaseExists,
  query,
  getOne,
};
