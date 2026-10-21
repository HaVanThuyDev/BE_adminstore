const { exec, spawn } = require('child_process');
const os = require('os');

class ProcessOptimizer {
  /**
   * 1. Lấy thông tin hệ thống đa nhân (Multi-core)
   */
  getSystemMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    return {
      coresCount: cpus.length,
      cpuModel: cpus[0]?.model || 'Unknown',
      memory: {
        totalMB: (totalMem / (1024 * 1024)).toFixed(2),
        freeMB: (freeMem / (1024 * 1024)).toFixed(2),
        usedMB: ((totalMem - freeMem) / (1024 * 1024)).toFixed(2),
      },
      uptimeSeconds: os.uptime(),
      loadAvg: os.loadavg(),
      nodeVersion: process.version,
      pid: process.pid,
    };
  }

  /**
   * 2. Thực thi lệnh độc lập bằng child_process.exec (Promise wrapper)
   */
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject({ error: error.message, stderr });
        }
        resolve({ stdout: stdout.trim(), stderr });
      });
    });
  }

  /**
   * 3. Chạy tiến trình con tách biệt (child_process.spawn) cho các tác vụ độc lập
   */
  spawnBackgroundTask(command, args = []) {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    return child.pid;
  }
}

module.exports = new ProcessOptimizer();
