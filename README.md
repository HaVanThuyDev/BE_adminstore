# 2HT Technology Backend REST API (Node.js + Express + MySQL)

Hệ thống Backend chuẩn kiến trúc phân tầng (Clean / Layered Architecture) phục vụ cho Website công nghệ và Cổng quản trị Admin 2HT Technology.

---

## 🏛️ Cấu trúc thư mục chuẩn dự án

```text
D:\Node\adminstore\
├── src/
│   ├── config/          # Cấu hình (env, database MySQL connection pool, cors, ...)
│   │   ├── database.js  # Kết nối MySQL bằng mysql2/promise, connection pool & helpers
│   │   └── env.js       # Quản lý tập trung các biến môi trường
│   ├── constants/       # Hằng số hệ thống (HTTP_STATUS, ROLES, ORDER_STATUS, ...)
│   ├── controllers/     # Nhận request, gọi service, trả response về client
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── consultationController.js
│   │   ├── headingController.js
│   │   ├── productController.js
│   │   └── settingController.js
│   ├── middlewares/     # Middleware xác thực JWT, phân quyền RBAC & global error handler
│   ├── models/          # Định nghĩa schema DDL MySQL và Seeder dữ liệu mẫu
│   │   ├── schema.js    # Tự động tạo các bảng MySQL (InnoDB, UTF-8 MB4)
│   │   └── seed.js      # Tự động nạp tài khoản admin, 26 tiêu đề, blog, sản phẩm
│   ├── repositories/    # Tầng giao tiếp trực tiếp với MySQL Database
│   │   ├── blogRepository.js
│   │   ├── consultationRepository.js
│   │   ├── headingRepository.js
│   │   ├── orderRepository.js
│   │   ├── productRepository.js
│   │   ├── settingRepository.js
│   │   └── userRepository.js
│   ├── routes/          # Định nghĩa endpoint API và gắn middleware/controller
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── consultationRoutes.js
│   │   ├── headingRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── settingRoutes.js
│   │   └── index.js
│   ├── services/        # Xử lý business logic nghiệp vụ
│   │   ├── authService.js
│   │   ├── blogService.js
│   │   ├── commonServices.js
│   │   ├── headingService.js
│   │   └── productService.js
│   ├── utils/           # Tiện ích dùng chung (apiResponse chuẩn envelope, jwt, hashPassword, slugify)
│   ├── validations/     # Schema kiểm tra tính hợp lệ dữ liệu đầu vào
│   ├── app.js           # Khởi tạo Express app, cấu hình CORS, parsers, routes, error handling
│   └── server.js        # Khởi động server, kết nối MySQL, auto migrate/seed và lắng nghe Port
├── .env                 # Cấu hình môi trường thực tế
├── .env.example         # Mẫu cấu hình môi trường
├── package.json         # Danh sách thư viện & scripts
└── README.md
```

---

## ⚙️ Cấu hình kết nối MySQL (`.env`)

Mở file `.env` tại `D:\Node\adminstore\.env` và điền thông tin tài khoản MySQL của bạn:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=adminstore_db

# JWT Authentication
JWT_SECRET=super_secret_jwt_key_2ht_technology_2026_!@#
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*
```

---

## 🚀 Lệnh khởi chạy Server

### 1. Khởi động ở chế độ thường:
```bash
cd D:\Node\adminstore
npm start
```

### 2. Khởi động ở chế độ lập trình (Tự reload khi sửa file):
```bash
cd D:\Node\adminstore
npm run dev
```

> **Lưu ý:** Khi chạy lần đầu, `server.js` sẽ tự động:
> 1. Tạo database `adminstore_db` nếu chưa có.
> 2. Tạo toàn bộ 7 bảng: `users`, `products`, `blogs`, `site_headings`, `orders`, `consultations`, `site_settings`.
> 3. Tự động nạp sẵn dữ liệu mẫu (26 tiêu đề, bài viết, sản phẩm, tài khoản admin).

---

## 🔑 Tài khoản Quản trị viên mặc định
- **Email:** `admin@2ht.vn`
- **Mật khẩu:** `Password@2026`
- **Quyền hạn:** `SUPER_ADMIN`

---

## 📋 Danh sách API Endpoints

- `POST /api/v1/auth/login`: Đăng nhập, nhận JWT token
- `GET /api/v1/auth/me`: Thông tin người dùng hiện tại
- `GET /api/v1/headings`: Toàn bộ tiêu đề website (`?page=Trang chủ` hoặc `?asMap=true`)
- `POST /api/v1/headings`: Thêm tiêu đề mới (Admin)
- `PATCH /api/v1/headings/:id/value`: Sửa nhanh tiêu đề (Inline Edit cho Admin)
- `PUT /api/v1/headings/:id`: Cập nhật chi tiết tiêu đề (Admin)
- `DELETE /api/v1/headings/:id`: Xóa tiêu đề (Admin)
- `GET /api/v1/blogs`: Danh sách bài viết (`?search=`, `?category=`, `?tag=`)
- `GET /api/v1/blogs/:slug`: Chi tiết bài viết theo slug
- `POST /api/v1/blogs`: Tạo bài viết mới (Admin)
- `PUT /api/v1/blogs/:id`: Sửa bài viết (Admin)
- `PATCH /api/v1/blogs/:id/toggle-featured`: Bật/tắt trạng thái nổi bật (Admin)
- `DELETE /api/v1/blogs/:id`: Xóa bài viết (Admin)
- `GET /api/v1/products`: Danh sách giải pháp phần mềm
- `GET /api/v1/products/:slug`: Chi tiết giải pháp theo slug
- `POST /api/v1/products`: Thêm sản phẩm mới (Admin)
- `PUT /api/v1/products/:id`: Sửa sản phẩm (Admin)
- `PATCH /api/v1/products/:id/toggle-publish`: Bật/tắt hiển thị (Admin)
- `DELETE /api/v1/products/:id`: Xóa sản phẩm (Admin)
- `POST /api/v1/orders/checkout`: Đặt hàng mua/dùng thử phần mềm
- `GET /api/v1/orders`: Danh sách đơn hàng (Admin)
- `PATCH /api/v1/orders/:id/status`: Đổi trạng thái đơn hàng (Admin)
- `POST /api/v1/consultations`: Gửi yêu cầu tư vấn từ khách hàng
- `GET /api/v1/consultations`: Danh sách leads tư vấn (Admin)
- `PATCH /api/v1/consultations/:id/status`: Cập nhật trạng thái lead (Admin)
- `GET /api/v1/settings`: Lấy thông tin liên hệ, hotline, slogan
- `PUT /api/v1/settings`: Cập nhật thông tin doanh nghiệp (Admin)
- `GET /api/v1/settings/dashboard/stats`: Thống kê doanh thu, đơn hàng, lead cho Dashboard
