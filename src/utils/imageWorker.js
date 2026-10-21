const { parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');

// workerData nhận buffer và tên file
const { buffer, originalName } = workerData;

try {
  const startTime = Date.now();
  const uint8Buffer = Buffer.from(buffer);

  // 1. Tính toán mã băm SHA-256 xác thực toàn vẹn file
  const sha256 = crypto.createHash('sha256').update(uint8Buffer).digest('hex');

  // 2. Trích xuất metadata
  const byteLength = uint8Buffer.length;
  const extension = originalName.split('.').pop().toLowerCase();

  const processTimeMs = Date.now() - startTime;

  parentPort.postMessage({
    success: true,
    sha256,
    byteLength,
    extension,
    processTimeMs,
  });
} catch (error) {
  parentPort.postMessage({
    success: false,
    error: error.message,
  });
}
