const { query, getOne } = require('../config/database');
const { hashPassword } = require('../utils/helpers');

const seedData = async () => {
  // 1. Seed Super Admin mặc định
  const adminExists = await getOne('SELECT id FROM users WHERE email = ?', ['admin@2ht.vn']);
  if (!adminExists) {
    const hashedPassword = await hashPassword('Password@2026');
    await query(
      `INSERT INTO users (id, email, password, fullName, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['usr-admin-01', 'admin@2ht.vn', hashedPassword, 'Quản Trị Viên 2HT', '0383717785', 'SUPER_ADMIN', 'ACTIVE']
    );
    console.log('✅ [Seeder] Đã tạo tài khoản Admin mặc định: admin@2ht.vn / Password@2026');
  }

  // 2. Seed Cấu hình hệ thống (Site Settings)
  const settingsExists = await getOne('SELECT id FROM site_settings WHERE id = 1');
  if (!settingsExists) {
    const socialLinks = JSON.stringify({
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      youtube: 'https://youtube.com',
    });
    await query(
      `INSERT INTO site_settings (id, brandName, brandSubname, slogan, mainMessage, contactEmail, supportEmail, hotline, address, workingHours, socialLinks, copyrightText)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        '2HT',
        'Information Technology',
        'Technology That Builds Your Future',
        'Kiến tạo giải pháp số. Nâng tầm doanh nghiệp.',
        'hathuongthuy113@gmail.com',
        'hathuongthuy113@gmail.com',
        '0383717785',
        'Nam Từ Liêm - Hà Nội',
        'Thứ 2 - Thứ 6: 08:30 - 18:00',
        socialLinks,
        '© 2026 2HT Information Technology. Nền tảng được xây dựng với Node.js, Express & MySQL.',
      ]
    );
    console.log('✅ [Seeder] Đã khởi tạo Cấu hình hệ thống');
  }

  // 3. Seed 26 Tiêu đề website (Site Headings)
  const headingRow = await getOne('SELECT COUNT(id) as count FROM site_headings');
  if (headingRow.count === 0) {
    const initialHeadings = [
      { id: 'heading-01', key: 'home_hero_eyebrow', section: 'Hero Banner', label: 'Eyebrow nhỏ phía trên tiêu đề chính', value: '2HT INFORMATION TECHNOLOGY', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-02', key: 'home_hero_title_1', section: 'Hero Banner', label: 'Tiêu đề chính (dòng 1)', value: 'Kiến tạo giải pháp số.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-03', key: 'home_hero_title_2', section: 'Hero Banner', label: 'Tiêu đề chính (dòng 2 - gradient)', value: 'Nâng tầm doanh nghiệp.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-04', key: 'home_hero_description', section: 'Hero Banner', label: 'Mô tả Hero Banner', value: 'Khám phá hệ sinh thái phần mềm do chúng tôi phát triển, giúp doanh nghiệp vận hành thông minh hơn, tối ưu quy trình và tăng tốc chuyển đổi số.', type: 'description', page: 'Trang chủ' },
      { id: 'heading-05', key: 'home_products_eyebrow', section: 'Sản phẩm nổi bật', label: 'Eyebrow section sản phẩm', value: 'Hệ sinh thái phần mềm', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-06', key: 'home_products_title', section: 'Sản phẩm nổi bật', label: 'Tiêu đề section sản phẩm', value: 'Khám phá hệ sinh thái sản phẩm.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-07', key: 'home_products_desc', section: 'Sản phẩm nổi bật', label: 'Mô tả section sản phẩm', value: 'Những giải pháp phần mềm được nghiên cứu và phát triển để giải quyết bài toán thực tế của doanh nghiệp hiện đại.', type: 'description', page: 'Trang chủ' },
      { id: 'heading-08', key: 'home_categories_eyebrow', section: 'Danh mục giải pháp', label: 'Eyebrow section danh mục', value: 'Danh mục giải pháp', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-09', key: 'home_categories_title', section: 'Danh mục giải pháp', label: 'Tiêu đề section danh mục', value: 'Lựa chọn lĩnh vực bạn quan tâm.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-10', key: 'home_why_eyebrow', section: 'Tại sao chọn 2HT', label: 'Eyebrow section năng lực', value: 'Năng lực vượt trội', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-11', key: 'home_why_title', section: 'Tại sao chọn 2HT', label: 'Tiêu đề section năng lực', value: 'Tại sao doanh nghiệp chọn hợp tác ?', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-12', key: 'home_tech_eyebrow', section: 'Công nghệ & Hạ tầng', label: 'Eyebrow section công nghệ', value: 'Công nghệ & Hạ tầng', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-13', key: 'home_tech_title', section: 'Công nghệ & Hạ tầng', label: 'Tiêu đề section công nghệ', value: 'Ngăn xếp công nghệ hàng đầu thế giới.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-14', key: 'home_projects_eyebrow', section: 'Dự án tiêu biểu', label: 'Eyebrow section dự án', value: 'Portfolio & Case Studies', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-15', key: 'home_projects_title', section: 'Dự án tiêu biểu', label: 'Tiêu đề section dự án', value: 'Dự án tiêu biểu đã triển khai.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-16', key: 'home_process_eyebrow', section: 'Quy trình làm việc', label: 'Eyebrow section quy trình', value: 'Quy trình 6 bước chuẩn mực', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-17', key: 'home_process_title', section: 'Quy trình làm việc', label: 'Tiêu đề section quy trình', value: 'Quy trình làm việc chuyên nghiệp.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-18', key: 'home_blog_eyebrow', section: 'Bài viết mới nhất', label: 'Eyebrow section blog', value: 'Kiến thức & Góc nhìn công nghệ', type: 'eyebrow', page: 'Trang chủ' },
      { id: 'heading-19', key: 'home_blog_title', section: 'Bài viết mới nhất', label: 'Tiêu đề section blog', value: 'Bài viết mới nhất từ chuyên gia', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-20', key: 'home_cta_title', section: 'Call To Action', label: 'Tiêu đề CTA cuối trang', value: 'Bạn có ý tưởng? Hãy cùng chúng tôi hiện thực hóa.', type: 'heading', page: 'Trang chủ' },
      { id: 'heading-21', key: 'products_page_title', section: 'Trang sản phẩm', label: 'Tiêu đề chính trang sản phẩm', value: 'Danh mục Giải pháp Phần mềm', type: 'heading', page: 'Sản phẩm' },
      { id: 'heading-22', key: 'products_page_desc', section: 'Trang sản phẩm', label: 'Mô tả trang sản phẩm', value: 'Khám phá hệ sinh thái giải pháp số được thiết kế riêng cho doanh nghiệp hiện đại.', type: 'description', page: 'Sản phẩm' },
      { id: 'heading-23', key: 'blog_page_title', section: 'Trang bài viết', label: 'Tiêu đề chính trang blog', value: 'Kiến thức & Góc nhìn Công nghệ', type: 'heading', page: 'Blog' },
      { id: 'heading-24', key: 'blog_page_desc', section: 'Trang bài viết', label: 'Mô tả trang blog', value: 'Chia sẻ chuyên sâu từ đội ngũ kỹ sư và chuyên gia giải pháp của 2HT.', type: 'description', page: 'Blog' },
      { id: 'heading-25', key: 'contact_page_title', section: 'Trang liên hệ', label: 'Tiêu đề chính trang liên hệ', value: 'Liên hệ tư vấn giải pháp', type: 'heading', page: 'Liên hệ' },
      { id: 'heading-26', key: 'about_page_title', section: 'Trang giới thiệu', label: 'Tiêu đề chính trang giới thiệu', value: 'Về 2HT Information Technology', type: 'heading', page: 'Giới thiệu' },
    ];

    for (const h of initialHeadings) {
      await query(
        `INSERT INTO site_headings (id, \`key\`, section, label, value, type, page)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [h.id, h.key, h.section, h.label, h.value, h.type, h.page]
      );
    }
    console.log('✅ [Seeder] Đã seed 26 tiêu đề website vào MySQL');
  }

  // 4. Seed Blogs
  const blogRow = await getOne('SELECT COUNT(id) as count FROM blogs');
  if (blogRow.count === 0) {
    const initialBlogs = [
      {
        id: 'blog-01',
        slug: 'chuyen-doi-so-doanh-nghiep-2026',
        title: 'Xu hướng chuyển đổi số 2026: Từ tự động hóa quy trình đến trí tuệ nhân tạo thực chiến',
        excerpt: 'Làm thế nào để doanh nghiệp vừa và nhỏ (SMEs) không bị bỏ lại phía sau trong làn sóng số hóa toàn diện năm 2026.',
        content: `Trong bối cảnh nền kinh tế số phát triển như vũ bão, việc chuyển đổi số không còn là một lựa chọn xa xỉ mà là điều kiện sống còn của mọi doanh nghiệp.

### 1. Tại sao doanh nghiệp SMEs cần hành động ngay hôm nay?
Rất nhiều lãnh đạo doanh nghiệp nghĩ rằng chuyển đổi số chỉ dành cho các tập đoàn lớn với ngân sách hàng tỷ đồng. Tuy nhiên, sự thật là chính các doanh nghiệp SMEs mới là những đơn vị nhận được tỷ suất hoàn vốn (ROI) cao nhất khi số hóa.

### 2. Các trụ cột chuyển đổi số cốt lõi
- **Trụ cột 1 - Hợp nhất dữ liệu khách hàng (CRM & Omnichannel)**
- **Trụ cột 2 - Tự động hóa quy trình nội bộ (ERP Lite & E-Approval)**
- **Trụ cột 3 - Kiểm soát tài chính minh bạch**`,
        category: 'Chuyển đổi số',
        tags: JSON.stringify(['Chuyển đổi số', 'SMEs', 'Chiến lược công nghệ', 'ERP']),
        authorName: 'Nguyễn Huy Hoàng',
        authorRole: 'Chief Technology Officer (2HT)',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        publishedAt: '2026-03-20',
        readTime: '6 phút đọc',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        isFeatured: 1,
      },
      {
        id: 'blog-02',
        slug: 'kien-truc-microservices-spring-boot-react',
        title: 'Xây dựng hệ thống SaaS quy mô lớn với React, Spring Boot và Docker',
        excerpt: 'Chia sẻ kinh nghiệm thiết kế kiến trúc phần mềm chịu tải cao, module hóa và tối ưu hiệu suất từ đội ngũ kỹ sư 2HT.',
        content: `Khi quy mô người dùng tăng trưởng từ hàng nghìn lên hàng trăm nghìn phiên truy cập đồng thời, một kiến trúc monolithic nguyên khối thường bộc lộ những hạn chế lớn.

### 1. Lợi thế khi kết hợp React và Spring Boot
React ở tầng Frontend mang đến trải nghiệm người dùng siêu mượt mà nhờ cơ chế Virtual DOM và hệ sinh thái thư viện phong phú.

### 2. Đóng gói và điều phối với Docker & Kubernetes
Bằng cách container hóa từng dịch vụ thông qua Docker, quy trình CI/CD trở nên nhất quán trên mọi môi trường.`,
        category: 'Công nghệ phần mềm',
        tags: JSON.stringify(['React', 'Spring Boot', 'Docker', 'Kiến trúc SaaS', 'Microservices']),
        authorName: 'Trần Minh Tuấn',
        authorRole: 'Principal Software Architect (2HT)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        publishedAt: '2026-03-15',
        readTime: '8 phút đọc',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        isFeatured: 0,
      },
    ];

    for (const b of initialBlogs) {
      await query(
        `INSERT INTO blogs (id, slug, title, excerpt, content, category, tags, authorName, authorRole, authorAvatar, publishedAt, readTime, coverImage, isFeatured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.id,
          b.slug,
          b.title,
          b.excerpt,
          b.content,
          b.category,
          b.tags,
          b.authorName,
          b.authorRole,
          b.authorAvatar,
          b.publishedAt,
          b.readTime,
          b.coverImage,
          b.isFeatured,
        ]
      );
    }
    console.log('✅ [Seeder] Đã seed danh sách bài viết mẫu');
  }

  // 5. Seed Products
  const prodRow = await getOne('SELECT COUNT(id) as count FROM products');
  if (prodRow.count === 0) {
    const prods = [
      {
        id: 'prod-01',
        name: '2HT E-Commerce Hub',
        slug: '2ht-ecommerce-hub',
        tagline: 'Nền tảng thương mại điện tử đa kênh thế hệ mới',
        category: 'ecommerce',
        categoryName: 'Thương mại điện tử',
        basePrice: 18500000,
        description: 'Hệ thống TMĐT tải cao tích hợp đồng bộ đa sàn Shopee, Lazada, TikTok Shop.',
        techStack: JSON.stringify(['React', 'Node.js', 'MySQL', 'Redis', 'Docker']),
        featuredBadge: 'Bán chạy nhất',
        mockupType: 'ecommerce',
      },
      {
        id: 'prod-02',
        name: '2HT Smart HRM & Payroll',
        slug: '2ht-smart-hrm-payroll',
        tagline: 'Phần mềm nhân sự, chấm công FaceID & tính lương tự động',
        category: 'hrm',
        categoryName: 'Nhân sự',
        basePrice: 14500000,
        description: 'Tự động hóa toàn diện quy trình nhân sự, chấm công GPS FaceID chống gian lận.',
        techStack: JSON.stringify(['React', 'Spring Boot', 'MySQL', 'Python AI']),
        featuredBadge: 'Giải pháp Hot',
        mockupType: 'hrm',
      },
      {
        id: 'prod-03',
        name: '2HT Cashflow Radar',
        slug: '2ht-cashflow-radar',
        tagline: 'Quản trị dòng tiền, dự báo tài chính doanh nghiệp thông minh',
        category: 'finance',
        categoryName: 'Tài chính',
        basePrice: 22000000,
        description: 'Báo cáo doanh thu, chi phí, công nợ tự động theo thời gian thực.',
        techStack: JSON.stringify(['React', 'Go', 'MySQL', 'Kafka']),
        featuredBadge: 'Độc quyền 2HT',
        mockupType: 'finance',
      },
    ];

    for (const p of prods) {
      await query(
        `INSERT INTO products (id, name, slug, tagline, category, categoryName, basePrice, description, techStack, featuredBadge, mockupType)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.slug, p.tagline, p.category, p.categoryName, p.basePrice, p.description, p.techStack, p.featuredBadge, p.mockupType]
      );
    }
    console.log('✅ [Seeder] Đã seed danh mục sản phẩm mẫu');
  }

  console.log('🎉 [Seeder] Hoàn tất quá trình Database Seeding!');
};

module.exports = { seedData };
