const { query } = require('../config/database');

const initMySQLTables = async () => {
  // 1. Users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(120) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullName VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NULL,
      role VARCHAR(20) DEFAULT 'CUSTOMER',
      status VARCHAR(20) DEFAULT 'ACTIVE',
      avatarUrl VARCHAR(500) NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Products
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(160) UNIQUE NOT NULL,
      tagline VARCHAR(255) NULL,
      category VARCHAR(50) NOT NULL,
      categoryName VARCHAR(100) NOT NULL,
      basePrice DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      description TEXT NULL,
      longDescription LONGTEXT NULL,
      techStack JSON NOT NULL,
      featuredBadge VARCHAR(50) NULL,
      hasLiveDemo TINYINT(1) DEFAULT 1,
      mockupType VARCHAR(50) DEFAULT 'business',
      isPublished TINYINT(1) DEFAULT 1,
      rating DECIMAL(2, 1) DEFAULT 5.0,
      reviewsCount INT DEFAULT 1,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Blogs (Quản lý bài viết)
  await query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(260) UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content LONGTEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      tags JSON NOT NULL,
      authorName VARCHAR(100) NOT NULL,
      authorRole VARCHAR(100) NULL,
      authorAvatar VARCHAR(500) NULL,
      publishedAt VARCHAR(50) NOT NULL,
      readTime VARCHAR(30) NOT NULL,
      coverImage VARCHAR(500) NOT NULL,
      isFeatured TINYINT(1) DEFAULT 0,
      viewsCount INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Site Headings (Quản lý tiêu đề website linh hoạt)
  await query(`
    CREATE TABLE IF NOT EXISTS site_headings (
      id VARCHAR(50) PRIMARY KEY,
      \`key\` VARCHAR(100) UNIQUE NOT NULL,
      section VARCHAR(100) NOT NULL,
      label VARCHAR(150) NOT NULL,
      value TEXT NOT NULL,
      type VARCHAR(30) NOT NULL,
      page VARCHAR(50) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Orders (Đơn hàng mua bản quyền & dùng thử)
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      customerName VARCHAR(100) NOT NULL,
      customerEmail VARCHAR(120) NOT NULL,
      customerPhone VARCHAR(20) NOT NULL,
      customerCompany VARCHAR(150) NULL,
      total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      status VARCHAR(30) DEFAULT 'DEMO_PENDING',
      paymentMethod VARCHAR(30) DEFAULT 'VIETQR',
      paymentStatus VARCHAR(30) DEFAULT 'UNPAID',
      notes TEXT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. Consultations (Leads tư vấn giải pháp)
  await query(`
    CREATE TABLE IF NOT EXISTS consultations (
      id VARCHAR(50) PRIMARY KEY,
      fullName VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(120) NULL,
      company VARCHAR(150) NULL,
      serviceInterest VARCHAR(150) NOT NULL,
      estimatedBudget VARCHAR(100) NULL,
      message TEXT NULL,
      status VARCHAR(30) DEFAULT 'NEW',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 7. Site Settings (Cấu hình thương hiệu)
  await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY DEFAULT 1,
      brandName VARCHAR(100) NOT NULL,
      brandSubname VARCHAR(150) NOT NULL,
      slogan VARCHAR(255) NULL,
      mainMessage VARCHAR(255) NULL,
      contactEmail VARCHAR(120) NOT NULL,
      supportEmail VARCHAR(120) NULL,
      hotline VARCHAR(20) NOT NULL,
      address VARCHAR(255) NOT NULL,
      workingHours VARCHAR(100) NOT NULL,
      socialLinks JSON NOT NULL,
      copyrightText TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ [Schema] Đã khởi tạo các bảng MySQL thành công!');
};

module.exports = {
  initMySQLTables,
};
