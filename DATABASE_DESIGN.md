# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU & KIẾN TRÚC HIỆU NĂNG CAO (HIGH PERFORMANCE BACKEND)

- **Database:** MySQL 8.0+ (`InnoDB`, `utf8mb4_unicode_ci`)
- **Tên Bảng & Cột:** 100% Tiếng Anh, **IN HOA (UPPERCASE)**
- **Kiến trúc Tối ưu:**
  - **Module `cluster`:** Tận dụng tối đa CPU đa nhân (Multi-Core 8 CPUs).
  - **Module `worker_threads`:** Xử lý tính toán nặng (hashing SHA-256, phân tích ảnh) không chặn Event Loop.
  - **Module `child_process`:** Quản lý các tiến trình tác vụ chạy ngầm độc lập.
  - **Stream & Backpressure Control:** Kiểm soát luồng ghi Cloudinary CDN chống tràn bộ nhớ RAM (OOM).

---

## 1. BẢNG `DATA_SOUSES` (Nguồn dữ liệu tệp tin Media & Ảnh Cloudinary)

| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa / Comment Tiếng Việt |
|---|---|---|---|
| `ID` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Khóa chính tự tăng dạng số ID của ảnh lưu ở bảng chính |
| `FILE_NAME` | VARCHAR(255) | NOT NULL | Tên tệp tin duy nhất sinh ra trên hệ thống |
| `ORIGINAL_NAME` | VARCHAR(255) | NOT NULL | Tên tệp tin gốc ban đầu khi người dùng tải lên |
| `MIME_TYPE` | VARCHAR(100) | NOT NULL | Định dạng phương tiện (`image/jpeg`, `image/png`, `image/webp`...) |
| `FILE_SIZE` | BIGINT | NOT NULL | Kích thước của tệp tính bằng bytes |
| `CLOUDINARY_URL` | VARCHAR(500) | NULL | Đường dẫn tuyệt đối URL của ảnh sau khi đẩy thành công lên Cloudinary CDN |
| `PUBLIC_ID` | VARCHAR(255) | NULL | Mã định danh quản lý tệp trên hệ thống đám mây Cloudinary |
| `STATUS` | VARCHAR(30) | NOT NULL, DEFAULT 'PENDING' | Trạng thái xử lý: `PENDING` (chờ đẩy), `COMPLETED` (thành công), `FAILED` (lỗi) |
| `CREATED_AT` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời điểm bắt đầu tiếp nhận tải tệp lên |
| `UPDATED_AT` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Thời điểm cập nhật liên kết Cloudinary hoàn tất |

---

## 2. CÁC BẢNG HỆ THỐNG KHÁC

- `USERS`: Quản lý tài khoản quản trị và người dùng (`ID`, `EMAIL`, `PASSWORD`, `FULL_NAME`, `ROLE`, `STATUS`...)
- `PRODUCTS`: Danh mục gói phần mềm giải pháp (`ID`, `NAME`, `SLUG`, `CATEGORY`, `BASE_PRICE`, `TECH_STACK`...)
- `BLOGS`: Quản lý bài viết tin tức công nghệ (`ID`, `TITLE`, `SLUG`, `CONTENT`, `CATEGORY`, `TAGS`, `IS_FEATURED`...)
- `SITE_HEADINGS`: Tiêu đề & nội dung hiển thị linh hoạt trên web (`ID`, `KEY`, `SECTION`, `LABEL`, `VALUE`, `TYPE`, `PAGE`...)
- `ORDERS`: Đơn hàng dùng thử và mua bản quyền (`ID`, `CUSTOMER_NAME`, `CUSTOMER_EMAIL`, `TOTAL`, `STATUS`, `PAYMENT_STATUS`...)
- `CONSULTATIONS`: Tiếp nhận yêu cầu tư vấn (`ID`, `FULL_NAME`, `PHONE`, `EMAIL`, `SERVICE_INTEREST`, `STATUS`...)
- `SITE_SETTINGS`: Cấu hình thông tin thương hiệu (`ID`, `BRAND_NAME`, `SLOGAN`, `HOTLINE`, `CONTACT_EMAIL`, `ADDRESS`...)

---

## 3. CƠ CHẾ TỐI ƯU HIỆU NĂNG CAO ĐÃ TRIỂN KHAI

### 1. Module `cluster` (Tận dụng CPU Đa Nhân)
- Cấu hình tại file `src/server.js`: Kiểm tra số nhân phần cứng máy tính (`os.cpus().length` = 8 nhân).
- Khi kích hoạt `USE_CLUSTER=true` trong `.env`, tiến trình Primary sẽ tự động fork 8 worker processes độc lập chia sẻ cùng Port 5000.
- Tích hợp cơ chế **Self-Healing**: Tự động spawn worker thay thế ngay lập tức nếu một worker gặp sự cố dừng đột ngột.

### 2. Module `worker_threads` (Xử lý tác vụ nặng)
- Triển khai tại `src/utils/imageWorker.js`: Xử lý băm mã SHA-256 xác thực toàn vẹn ảnh và phân tích kích thước Buffer trên một luồng Worker riêng biệt, ngăn chặn hoàn toàn việc nghẽn Event Loop của luồng chính Node.js.

### 3. Kiểm soát Backpressure trong Stream (Cloudinary Upload)
- Triển khai tại `src/services/dataSourceService.js`: Sử dụng `stream.pipeline` kết hợp `streamifier`.
- Khi máy chủ Cloudinary CDN chưa kịp tiếp nhận các khối dữ liệu (chunks), luồng sẽ kích hoạt sự kiện `pause` để dừng đọc bộ nhớ tạm và chỉ tiếp tục đọc (`resume`) khi bộ đệm đích đã được xả (`drain`). Điều này giúp tránh hiện tượng tràn bộ nhớ RAM (Out of Memory - OOM) khi có nhiều người dùng đồng thời tải lên ảnh kích thước lớn.

### 4. Module `child_process`
- Triển khai tại `src/utils/processOptimizer.js`: Cung cấp các hàm `executeCommand` và `spawnBackgroundTask` giúp thực thi các tác vụ nền độc lập và trích xuất chỉ số tài nguyên CPU / RAM theo thời gian thực.
