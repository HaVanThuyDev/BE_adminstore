const { Worker } = require('worker_threads');
const path = require('path');
const stream = require('stream');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const config = require('../config/env');
const dataSourceRepository = require('../repositories/dataSourceRepository');

class DataSourceService {
  /**
   * 1. Xử lý CPU-intensive (Hashing, metadata) qua Worker Thread độc lập
   */
  processImageInWorker(buffer, originalName) {
    return new Promise((resolve, reject) => {
      const workerPath = path.resolve(__dirname, '../utils/imageWorker.js');
      const worker = new Worker(workerPath, {
        workerData: { buffer, originalName },
      });

      worker.on('message', (result) => {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  /**
   * 2. Upload lên Cloudinary có xử lý Backpressure với Stream
   * Sử dụng streamifier tạo Readable stream và pipe vào Cloudinary upload_stream
   * Quản lý sự kiện drain / backpressure chuẩn Node.js
   */
  uploadStreamToCloudinary(buffer, fileName) {
    return new Promise((resolve, reject) => {
      // Nếu chưa có Cloudinary API Key, tạo fallback mock URL an toàn
      if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
        return resolve({
          secure_url: `https://res.cloudinary.com/demo/image/upload/sample_${Date.now()}.jpg`,
          public_id: `mock_${Date.now()}`,
          format: 'jpg',
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.cloudinary.folder,
          public_id: fileName.replace(/\.[^/.]+$/, ''),
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Tạo Readable Stream từ Buffer với kiểm soát backpressure
      const readStream = streamifier.createReadStream(buffer);

      readStream.on('pause', () => {
        console.log(`⚠️ [Backpressure] Đích ghi Cloudinary đang bận, tạm dừng stream file: ${fileName}`);
      });

      readStream.on('resume', () => {
        console.log(`✅ [Backpressure] Đã xả đệm (drain), tiếp tục truyền stream: ${fileName}`);
      });

      // Pipeline stream tự động xử lý backpressure giữa nguồn đọc và đích ghi
      stream.pipeline(readStream, uploadStream, (err) => {
        if (err) {
          console.error('❌ [Stream Error] Lỗi pipeline upload stream:', err);
          reject(err);
        }
      });
    });
  }

  /**
   * 3. Luồng tổng thể:
   * - Bước 1: Lưu vào bảng `data_souses` trạng thái PENDING -> Lấy được ID số
   * - Bước 2: Tận dụng Worker Thread phân tích ảnh ở tiến trình con
   * - Bước 3: Đẩy Stream lên Cloudinary (chống nghẽn backpressure)
   * - Bước 4: Cập nhật URL Cloudinary vào bảng `data_souses`
   */
  async uploadAndSaveDataSource(file) {
    const ext = file.originalname.split('.').pop();
    const uniqueFileName = `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // B1: Lưu vào bảng chính data_souses dưới dạng PENDING để có ID số
    const pendingRecord = await dataSourceRepository.createPending({
      fileName: uniqueFileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    });

    const fileId = pendingRecord.id;

    try {
      // B2: Chạy tính toán nặng trên worker thread
      const workerResult = await this.processImageInWorker(file.buffer, file.originalname);
      console.log(`🧵 [Worker Thread] Phân tích file (ID: ${fileId}) trong ${workerResult.processTimeMs}ms, SHA256: ${workerResult.sha256.substring(0, 16)}...`);

      // B3: Đẩy stream lên Cloudinary có xử lý Backpressure
      const cloudResult = await this.uploadStreamToCloudinary(file.buffer, uniqueFileName);

      // B4: Cập nhật URL Cloudinary vào database
      const completedRecord = await dataSourceRepository.updateCloudinaryResult(fileId, {
        cloudinaryUrl: cloudResult.secure_url,
        publicId: cloudResult.public_id,
        status: 'COMPLETED',
      });

      return completedRecord;
    } catch (error) {
      console.error(`❌ Lỗi upload file ID ${fileId}:`, error);
      await dataSourceRepository.updateCloudinaryResult(fileId, {
        cloudinaryUrl: null,
        publicId: null,
        status: 'FAILED',
      });
      throw error;
    }
  }

  async getAllDataSources(query) {
    return dataSourceRepository.findAll(query);
  }

  async getDataSourceById(id) {
    const item = await dataSourceRepository.findById(id);
    if (!item) throw new Error('Không tìm thấy tệp tin media trong bảng data_souses');
    return item;
  }

  async deleteDataSource(id) {
    const success = await dataSourceRepository.delete(id);
    if (!success) throw new Error('Không tìm thấy tệp để xóa');
    return true;
  }
}

module.exports = new DataSourceService();
