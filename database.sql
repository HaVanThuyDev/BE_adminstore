-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU: 2HT TECHNOLOGY & ADMIN PORTAL
-- HỆ QUẢN TRỊ CSDL: MySQL 8.0+
-- ĐỊNH DẠNG: TÊN BẢNG VÀ TÊN CỘT IN HOA (UPPERCASE), TIẾNG ANH, CÓ COMMENT TIẾNG VIỆT
-- BẢNG MÃ: UTF8MB4 (HỖ TRỢ TIẾNG VIỆT CÓ DẤU & EMOJI)
-- STORAGE ENGINE: InnoDB
-- =============================================================================

-- TẠO DATABASE NẾU CHƯA CÓ
CREATE DATABASE IF NOT EXISTS `ADMINSTORE_DB`
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ADMINSTORE_DB`;

-- =============================================================================
-- BẢNG 1: USERS (QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG & QUẢN TRỊ VIÊN)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `USERS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Khóa chính định danh duy nhất của tài khoản (UUID hoặc mã tiền tố)',
  `EMAIL` VARCHAR(120) NOT NULL COMMENT 'Địa chỉ email đăng nhập của người dùng, duy nhất toàn hệ thống',
  `PASSWORD` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được mã hóa an toàn bằng thuật toán BCrypt',
  `FULL_NAME` VARCHAR(100) NOT NULL COMMENT 'Họ và tên đầy đủ của người dùng hoặc chuyên viên quản trị',
  `PHONE` VARCHAR(20) NULL COMMENT 'Số điện thoại liên lạc chính thức',
  `ROLE` VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' COMMENT 'Vai trò phân quyền: SUPER_ADMIN, ADMIN, STAFF, CUSTOMER',
  `STATUS` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'Trạng thái hoạt động của tài khoản: ACTIVE, BLOCKED, PENDING',
  `AVATAR_URL` VARCHAR(500) NULL COMMENT 'Đường dẫn liên kết URL tới ảnh đại diện của người dùng',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khởi tạo bản ghi tài khoản',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật thông tin tài khoản gần nhất',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_USERS_EMAIL` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông tin tài khoản người dùng và quản trị viên';


-- =============================================================================
-- BẢNG 2: DATA_SOUSES (QUẢN LÝ NGUỒN TỆP TIN MEDIA, ẢNH TẢI LÊN CLOUDINARY)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `DATA_SOUSES` (
  `ID` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính tự tăng dạng số ID của ảnh lưu ở bảng chính',
  `FILE_NAME` VARCHAR(255) NOT NULL COMMENT 'Tên tệp tin duy nhất sinh ra trên hệ thống',
  `ORIGINAL_NAME` VARCHAR(255) NOT NULL COMMENT 'Tên tệp tin gốc ban đầu khi người dùng tải lên từ máy tính',
  `MIME_TYPE` VARCHAR(100) NOT NULL COMMENT 'Định dạng phương tiện (image/jpeg, image/png, image/webp)',
  `FILE_SIZE` BIGINT NOT NULL COMMENT 'Kích thước của tệp tính bằng bytes',
  `CLOUDINARY_URL` VARCHAR(500) NULL COMMENT 'Đường dẫn tuyệt đối URL của ảnh sau khi đẩy thành công lên Cloudinary CDN',
  `PUBLIC_ID` VARCHAR(255) NULL COMMENT 'Mã định danh quản lý tệp trên hệ thống đám mây Cloudinary',
  `STATUS` VARCHAR(30) NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái xử lý: PENDING, COMPLETED, FAILED',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm bắt đầu tiếp nhận tải tệp lên',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật liên kết Cloudinary hoàn tất',
  PRIMARY KEY (`ID`),
  KEY `IDX_DATA_SOUSES_STATUS` (`STATUS`),
  KEY `IDX_DATA_SOUSES_CREATED_AT` (`CREATED_AT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ nguồn dữ liệu tệp tin media, ảnh Cloudinary với ID số';


-- =============================================================================
-- BẢNG 3: PRODUCTS (QUẢN LÝ DANH MỤC SẢN PHẨM & GIẢI PHÁP PHẦN MỀM)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `PRODUCTS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Mã định danh sản phẩm (Ví dụ: prod-01, prod-02)',
  `NAME` VARCHAR(150) NOT NULL COMMENT 'Tên gọi chính thức của gói giải pháp hoặc sản phẩm phần mềm',
  `SLUG` VARCHAR(160) NOT NULL COMMENT 'Đường dẫn tĩnh tối ưu SEO trên thanh địa chỉ URL web',
  `TAGLINE` VARCHAR(255) NULL COMMENT 'Khẩu hiệu ngắn hoặc mô tả vắn tắt giá trị cốt lõi sản phẩm',
  `CATEGORY` VARCHAR(50) NOT NULL COMMENT 'Mã định danh nhóm danh mục: ecommerce, management, website, finance, hrm, custom',
  `CATEGORY_NAME` VARCHAR(100) NOT NULL COMMENT 'Tên hiển thị tiếng Việt của nhóm danh mục giải pháp',
  `BASE_PRICE` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá đề xuất mua bản quyền hoặc chuyển giao giải pháp (VNĐ)',
  `DESCRIPTION` TEXT NULL COMMENT 'Mô tả tóm tắt tính năng và tiện ích của phần mềm',
  `LONG_DESCRIPTION` LONGTEXT NULL COMMENT 'Mô tả chi tiết kiến trúc kỹ thuật, luồng vận hành và thông số',
  `TECH_STACK` JSON NOT NULL COMMENT 'Danh sách mảng công nghệ sử dụng dưới định dạng JSON (VD: ["React", "Spring Boot", "MySQL"])',
  `FEATURED_BADGE` VARCHAR(50) NULL COMMENT 'Huy hiệu nổi bật ghim trên thẻ (Ví dụ: Bán chạy nhất, Giải pháp Hot, Độc quyền)',
  `HAS_LIVE_DEMO` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Cờ kiểm tra có môi trường Sandbox dùng thử hay không (1: Có, 0: Không)',
  `MOCKUP_TYPE` VARCHAR(50) NOT NULL DEFAULT 'business' COMMENT 'Loại khung mockup preview hiển thị giao diện: ecommerce, hrm, business, finance, website',
  `PREVIEW_IMAGE` VARCHAR(500) NULL COMMENT 'Đường dẫn liên kết URL ảnh xem trước giao diện sản phẩm',
  `DATA_SOURCE_ID` BIGINT NULL COMMENT 'Mã định danh ID số của ảnh lưu trong bảng DATA_SOUSES',
  `IS_PUBLISHED` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái hiển thị công khai trên website (1: Đang hiện, 0: Đang ẩn)',
  `RATING` DECIMAL(2, 1) NOT NULL DEFAULT 5.0 COMMENT 'Điểm đánh giá uy tín trung bình từ khách hàng (từ 1.0 đến 5.0)',
  `REVIEWS_COUNT` INT NOT NULL DEFAULT 1 COMMENT 'Tổng số lượt khách hàng đã gửi đánh giá phản hồi',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo mới bản ghi sản phẩm',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật thông tin sản phẩm gần nhất',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_PRODUCTS_SLUG` (`SLUG`),
  KEY `IDX_PRODUCTS_CATEGORY` (`CATEGORY`),
  KEY `IDX_PRODUCTS_PUBLISHED` (`IS_PUBLISHED`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ danh mục sản phẩm và giải pháp phần mềm doanh nghiệp';


-- =============================================================================
-- BẢNG 4: BLOGS (QUẢN LÝ BÀI VIẾT, CHUYÊN ĐỀ & TIN TỨC CÔNG NGHỆ)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `BLOGS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Mã định danh duy nhất của bài viết (Ví dụ: blog-01, blog-02)',
  `TITLE` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề chính thức của bài viết hiển thị trên website',
  `SLUG` VARCHAR(260) NOT NULL COMMENT 'Đường dẫn tĩnh thân thiện SEO cho bài viết',
  `EXCERPT` TEXT NOT NULL COMMENT 'Đoạn trích dẫn tóm tắt nội dung để hiển thị ở trang danh sách và thẻ meta',
  `CONTENT` LONGTEXT NOT NULL COMMENT 'Toàn bộ nội dung bài viết chi tiết, định dạng hỗ trợ mã Markdown / HTML',
  `CATEGORY` VARCHAR(100) NOT NULL COMMENT 'Chuyên mục bài viết (Chuyển đổi số, Công nghệ phần mềm, UI/UX Design, DevOps)',
  `TAGS` JSON NOT NULL COMMENT 'Mảng các thẻ từ khóa tìm kiếm bài viết lưu dạng JSON (Ví dụ: ["React", "Spring Boot", "ERP"])',
  `AUTHOR_NAME` VARCHAR(100) NOT NULL COMMENT 'Họ và tên của tác giả hoặc chuyên gia viết bài',
  `AUTHOR_ROLE` VARCHAR(100) NULL COMMENT 'Chức danh hoặc vị trí chuyên môn của tác giả',
  `AUTHOR_AVATAR` VARCHAR(500) NULL COMMENT 'Đường dẫn URL ảnh chân dung của tác giả',
  `PUBLISHED_AT` VARCHAR(50) NOT NULL COMMENT 'Ngày công bố phát hành bài viết (Định dạng YYYY-MM-DD)',
  `READ_TIME` VARCHAR(30) NOT NULL COMMENT 'Thời lượng ước tính để đọc xong bài viết (Ví dụ: 5 phút đọc, 8 phút đọc)',
  `COVER_IMAGE` VARCHAR(500) NOT NULL COMMENT 'Đường dẫn liên kết hình ảnh bìa minh họa của bài viết',
  `IS_FEATURED` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Cờ đánh dấu bài viết tiêu điểm ghim lên Trang chủ (1: Nổi bật, 0: Thường)',
  `VIEWS_COUNT` INT NOT NULL DEFAULT 0 COMMENT 'Bộ đếm tổng số lượt người dùng đã truy cập xem bài viết',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khởi tạo bản ghi bài viết',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm chỉnh sửa bài viết gần nhất',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_BLOGS_SLUG` (`SLUG`),
  KEY `IDX_BLOGS_CATEGORY` (`CATEGORY`),
  KEY `IDX_BLOGS_FEATURED` (`IS_FEATURED`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý bài viết tin tức và kiến thức chuyên môn công nghệ';


-- =============================================================================
-- BẢNG 5: SITE_HEADINGS (QUẢN LÝ TIÊU ĐỀ & VĂN BẢN HIỂN THỊ TRÊN GIAO DIỆN)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `SITE_HEADINGS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Khóa chính định danh mục tiêu đề (Ví dụ: heading-01, heading-02)',
  `KEY` VARCHAR(100) NOT NULL COMMENT 'Khóa định danh lập trình không trùng lặp (Ví dụ: home_hero_title_1, home_hero_desc)',
  `SECTION` VARCHAR(100) NOT NULL COMMENT 'Tên khu vực hiển thị trên giao diện (Hero Banner, Sản phẩm nổi bật, Quy trình)',
  `LABEL` VARCHAR(150) NOT NULL COMMENT 'Nhãn mô tả vị trí hiển thị để người quản trị dễ dàng nhận biết khi chỉnh sửa',
  `VALUE` TEXT NOT NULL COMMENT 'Nội dung văn bản thực tế sẽ hiển thị trên giao diện web',
  `TYPE` VARCHAR(30) NOT NULL COMMENT 'Phân loại cấp bậc văn bản: heading, subheading, eyebrow, description',
  `PAGE` VARCHAR(50) NOT NULL COMMENT 'Trang áp dụng nội dung tiêu đề: Trang chủ, Sản phẩm, Blog, Liên hệ, Giới thiệu',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khởi tạo tiêu đề',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật giá trị tiêu đề gần nhất',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_SITE_HEADINGS_KEY` (`KEY`),
  KEY `IDX_SITE_HEADINGS_PAGE` (`PAGE`),
  KEY `IDX_SITE_HEADINGS_SECTION` (`SECTION`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý nội dung các tiêu đề, khẩu hiệu và đoạn mô tả động trên website';


-- =============================================================================
-- BẢNG 6: ORDERS (QUẢN LÝ ĐƠN HÀNG DÙNG THỬ & MUA BẢN QUYỀN PHẦN MỀM)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `ORDERS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Mã hóa đơn đơn hàng duy nhất (Ví dụ: ORD-123456)',
  `CUSTOMER_NAME` VARCHAR(100) NOT NULL COMMENT 'Họ và tên khách hàng hoặc người đại diện doanh nghiệp đặt mua',
  `CUSTOMER_EMAIL` VARCHAR(120) NOT NULL COMMENT 'Địa chỉ email tiếp nhận tài khoản kích hoạt và thông tin chuyển giao',
  `CUSTOMER_PHONE` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại liên lạc của khách hàng',
  `CUSTOMER_COMPANY` VARCHAR(150) NULL COMMENT 'Tên công ty hoặc tổ chức của khách hàng (nếu có)',
  `TOTAL` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng giá trị đơn hàng thực thanh toán (VNĐ)',
  `STATUS` VARCHAR(30) NOT NULL DEFAULT 'DEMO_PENDING' COMMENT 'Trạng thái xử lý: DEMO_PENDING, DEMO_PROCESSING, DEMO_COMPLETED, DEMO_CANCELLED',
  `PAYMENT_METHOD` VARCHAR(30) NOT NULL DEFAULT 'VIETQR' COMMENT 'Phương thức thanh toán: VIETQR, BANK_TRANSFER, CREDIT_CARD, DEMO_FREE',
  `PAYMENT_STATUS` VARCHAR(30) NOT NULL DEFAULT 'UNPAID' COMMENT 'Tình trạng thanh toán: UNPAID, PAID, REFUNDED',
  `NOTES` TEXT NULL COMMENT 'Ghi chú thêm về yêu cầu cài đặt hoặc tùy chỉnh của khách hàng',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khách hàng gửi đơn đặt hàng',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật trạng thái đơn hàng gần nhất',
  PRIMARY KEY (`ID`),
  KEY `IDX_ORDERS_STATUS` (`STATUS`),
  KEY `IDX_ORDERS_PAYMENT_STATUS` (`PAYMENT_STATUS`),
  KEY `IDX_ORDERS_CREATED_AT` (`CREATED_AT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông tin đơn hàng mua bản quyền và yêu cầu triển khai phần mềm';


-- =============================================================================
-- BẢNG 7: CONSULTATIONS (TIẾP NHẬN YÊU CẦU TƯ VẤN & KHẢO SÁT NGHIỆP VỤ)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `CONSULTATIONS` (
  `ID` VARCHAR(50) NOT NULL COMMENT 'Khóa chính định danh yêu cầu tư vấn (Ví dụ: cs-1792336435000)',
  `FULL_NAME` VARCHAR(100) NOT NULL COMMENT 'Họ và tên đầy đủ của người gửi liên hệ',
  `PHONE` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại tiếp nhận tư vấn chuyên sâu',
  `EMAIL` VARCHAR(120) NULL COMMENT 'Hòm thư điện tử của người liên hệ',
  `COMPANY` VARCHAR(150) NULL COMMENT 'Tên doanh nghiệp có nhu cầu triển khai phần mềm',
  `SERVICE_INTEREST` VARCHAR(150) NOT NULL COMMENT 'Gói giải pháp hoặc dịch vụ quan tâm (Ví dụ: Phần mềm ERP, Website Doanh nghiệp)',
  `ESTIMATED_BUDGET` VARCHAR(100) NULL COMMENT 'Khoảng ngân sách dự kiến của khách hàng (Ví dụ: 50 - 100 triệu, Trên 200 triệu)',
  `MESSAGE` TEXT NULL COMMENT 'Nội dung chi tiết bài toán thực tế của doanh nghiệp cần giải quyết',
  `STATUS` VARCHAR(30) NOT NULL DEFAULT 'NEW' COMMENT 'Tiến độ xử lý lead tư vấn: NEW, IN_DISCUSSION, QUALIFIED, CONVERTED, CANCELLED',
  `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khách hàng gửi form trên website',
  `UPDATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm chuyên viên cập nhật tiến độ tư vấn gần nhất',
  PRIMARY KEY (`ID`),
  KEY `IDX_CONSULTATIONS_STATUS` (`STATUS`),
  KEY `IDX_CONSULTATIONS_CREATED_AT` (`CREATED_AT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông tin khách hàng tiềm năng gửi yêu cầu tư vấn giải pháp';


-- =============================================================================
-- BẢNG 8: SITE_SETTINGS (CẤU HÌNH THƯƠNG HIỆU & THÔNG TIN LIÊN HỆ DOANH NGHIỆP)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `SITE_SETTINGS` (
  `ID` INT NOT NULL DEFAULT 1 COMMENT 'Khóa chính cố định (Bảng chỉ chứa 1 dòng cấu hình duy nhất - Singleton Pattern)',
  `BRAND_NAME` VARCHAR(100) NOT NULL COMMENT 'Tên thương hiệu doanh nghiệp (Ví dụ: 2HT)',
  `BRAND_SUBNAME` VARCHAR(150) NOT NULL COMMENT 'Tên định danh bổ trợ thương hiệu (Ví dụ: Information Technology)',
  `SLOGAN` VARCHAR(255) NULL COMMENT 'Khẩu hiệu thương hiệu (Ví dụ: Technology That Builds Your Future)',
  `MAIN_MESSAGE` VARCHAR(255) NULL COMMENT 'Thông điệp mở đầu tại Hero Banner (Ví dụ: Kiến tạo giải pháp số. Nâng tầm doanh nghiệp.)',
  `CONTACT_EMAIL` VARCHAR(120) NOT NULL COMMENT 'Địa chỉ email chính thức tiếp nhận thông tin khách hàng',
  `SUPPORT_EMAIL` VARCHAR(120) NULL COMMENT 'Hòm thư điện tử phòng hỗ trợ kỹ thuật khách hàng',
  `HOTLINE` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại đường dây nóng hỗ trợ tư vấn',
  `ADDRESS` VARCHAR(255) NOT NULL COMMENT 'Địa chỉ văn phòng giao dịch hoặc trụ sở làm việc chính thức',
  `WORKING_HOURS` VARCHAR(100) NOT NULL COMMENT 'Quy định khung giờ làm việc (Ví dụ: Thứ 2 - Thứ 6: 08:30 - 18:00)',
  `SOCIAL_LINKS` JSON NOT NULL COMMENT 'Danh sách đường dẫn mạng xã hội lưu dạng JSON (Facebook, LinkedIn, GitHub, YouTube)',
  `COPYRIGHT_TEXT` TEXT NOT NULL COMMENT 'Đoạn văn bản ghi chú bản quyền chân trang Footer website',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông số cấu hình thương hiệu và thông tin liên hệ toàn hệ thống';

-- =============================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA MẪU)
-- =============================================================================

-- 1. TÀI KHOẢN SUPER ADMIN MẶC ĐỊNH (MẬT KHẨU: Password@2026 ĐÃ BĂM BCRYPT)
INSERT INTO `USERS` (`ID`, `EMAIL`, `PASSWORD`, `FULL_NAME`, `PHONE`, `ROLE`, `STATUS`)
VALUES (
  'usr-admin-01',
  'admin@2ht.vn',
  '$2b$10$Z9VGLv.91qfHDW3GKUyg8u6YlCOTc5UolyCvzMikHuIne7c6TRqhi',
  'Quản Trị Viên 2HT',
  '0383717785',
  'SUPER_ADMIN',
  'ACTIVE'
) ON DUPLICATE KEY UPDATE `EMAIL` = `EMAIL`;

-- 2. CẤU HÌNH THƯƠNG HIỆU DOANH NGHIỆP
INSERT INTO `SITE_SETTINGS` (
  `ID`, `BRAND_NAME`, `BRAND_SUBNAME`, `SLOGAN`, `MAIN_MESSAGE`,
  `CONTACT_EMAIL`, `SUPPORT_EMAIL`, `HOTLINE`, `ADDRESS`, `WORKING_HOURS`, `SOCIAL_LINKS`, `COPYRIGHT_TEXT`
) VALUES (
  1,
  '2HT',
  'Information Technology',
  'Technology That Builds Your Future',
  'Kiến tạo giải pháp số. Nâng tầm doanh nghiệp.',
  'hathuongthuy113@gmail.com',
  'hathuongthuy113@gmail.com',
  '0383717785',
  'Nam Từ Liêm - Hà Nội',
  'Thứ 2 - Thứ 6: 08:30 - 18:00',
  '{"facebook": "https://facebook.com", "linkedin": "https://linkedin.com", "github": "https://github.com", "youtube": "https://youtube.com"}',
  '© 2026 2HT Information Technology. Nền tảng được xây dựng với Node.js, Express & MySQL.'
) ON DUPLICATE KEY UPDATE `ID` = 1;
