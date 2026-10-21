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
const toCamelCaseKey = (str) => {
  if (str.includes('_')) {
    return str.toLowerCase().replace(/_([a-z0-9])/g, (_, l) => l.toUpperCase());
  }
  if (str === str.toUpperCase()) {
    return str.toLowerCase();
  }
  return str;
};

const mapRowToCamelCase = (row) => {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[toCamelCaseKey(key)] = value;
  }
  return result;
};

const query = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  if (Array.isArray(rows)) {
    return rows.map(mapRowToCamelCase);
  }
  return rows;
};

// Lấy 1 bản ghi duy nhất
const getOne = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  if (Array.isArray(rows) && rows.length > 0) {
    return mapRowToCamelCase(rows[0]);
  }
  return null;
};

module.exports = {
  getPool,
  ensureDatabaseExists,
  query,
  getOne,
};
