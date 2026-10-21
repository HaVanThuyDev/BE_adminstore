const productService = require('../services/productService');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class ProductController {
  async getAll(req, res, next) {
    try {
      const data = await productService.getAllProducts(req.query);
      return ApiResponse.success(res, data, 'Lấy danh sách sản phẩm thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const data = await productService.getProductBySlug(req.params.slug);
      return ApiResponse.success(res, data);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async create(req, res, next) {
    try {
      const created = await productService.createProduct(req.body);
      return ApiResponse.success(res, created, 'Thêm sản phẩm thành công', HTTP_STATUS.CREATED);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await productService.updateProduct(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Cập nhật sản phẩm thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async togglePublish(req, res, next) {
    try {
      const result = await productService.togglePublish(req.params.id);
      return ApiResponse.success(res, result, 'Cập nhật trạng thái hiển thị thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      return ApiResponse.success(res, null, 'Đã xóa sản phẩm thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

module.exports = new ProductController();
