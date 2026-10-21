const blogService = require('../services/blogService');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class BlogController {
  async getAll(req, res, next) {
    try {
      const data = await blogService.getAllBlogs(req.query);
      return ApiResponse.success(res, data, 'Lấy danh sách bài viết thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const data = await blogService.getBlogBySlug(req.params.slug);
      return ApiResponse.success(res, data);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async create(req, res, next) {
    try {
      const created = await blogService.createBlog(req.body);
      return ApiResponse.success(res, created, 'Tạo bài viết thành công', HTTP_STATUS.CREATED);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await blogService.updateBlog(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Cập nhật bài viết thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async toggleFeatured(req, res, next) {
    try {
      const result = await blogService.toggleFeatured(req.params.id);
      return ApiResponse.success(res, result, 'Cập nhật trạng thái nổi bật thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async delete(req, res, next) {
    try {
      await blogService.deleteBlog(req.params.id);
      return ApiResponse.success(res, null, 'Đã xóa bài viết thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

module.exports = new BlogController();
