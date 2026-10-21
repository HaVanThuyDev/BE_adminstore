const userRepository = require('../repositories/userRepository');
const { comparePassword, generateToken } = require('../utils/helpers');

class AuthService {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Tài khoản đã bị tạm khóa');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản người dùng');
    }
    return user;
  }
}

module.exports = new AuthService();
