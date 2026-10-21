const { orderService } = require('../services/commonServices');
const ApiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

class OrderController {
  async checkout(req, res, next) {
    try {
      const order = await orderService.checkout(req.body);
      return ApiResponse.success(res, order, 'Đặt hàng thành công', HTTP_STATUS.CREATED);
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();
      return ApiResponse.success(res, orders, 'Lấy danh sách đơn hàng thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await orderService.updateOrderStatus(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

module.exports = new OrderController();
