const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getSellerOrders,
  getOrderStats,
  addTrackingUpdate
} = require('../controllers/orderController');
const {
  validateOrder,
  handleValidationErrors
} = require('../middleware/validation');
const { protect, authorize, checkAdmin, checkSeller } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/seller-orders', checkSeller, getSellerOrders);
router.get('/stats', authorize('admin', 'seller'), getOrderStats);
router.get('/all', checkAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin', 'seller'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/tracking', authorize('admin', 'seller'), addTrackingUpdate);

module.exports = router;