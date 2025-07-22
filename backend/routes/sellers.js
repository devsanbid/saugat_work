const express = require('express');
const {
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getSellerOrders,
  updateOrderStatus,
  addTrackingUpdate,
  getSellerCustomers,
  getCustomerOrders
} = require('../controllers/orderController');
const {
  getUserStats,
  getSellerDashboard,
  getSellerAnalytics,
  getSellerSettings,
  updateSellerProfile
} = require('../controllers/userController');
const {
  createSellerCoupon,
  updateSellerCoupon,
  deleteSellerCoupon,
  getSellerCoupons,
  getSellerCouponById
} = require('../controllers/sellerCouponController');
const {
  validateProduct,
  validateCoupon,
  handleValidationErrors
} = require('../middleware/validation');
const { protect, checkSeller } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/status', (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Seller account required.'
      });
    }
    
    const isApproved = req.user.sellerInfo && req.user.sellerInfo.isApproved;
    
    res.json({
      success: true,
      data: {
        isApproved,
        sellerInfo: req.user.sellerInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking seller status'
    });
  }
});

router.use(checkSeller);

router.get('/dashboard/stats', getUserStats);
router.get('/dashboard', getSellerDashboard);
router.get('/analytics', getSellerAnalytics);
router.get('/products', getSellerProducts);
router.post('/products', validateProduct, handleValidationErrors, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/tracking', addTrackingUpdate);
router.get('/customers', getSellerCustomers);
router.get('/customers/:customerId/orders', getCustomerOrders);

// Coupon routes
router.get('/coupons', getSellerCoupons);
router.get('/coupons/:id', getSellerCouponById);
router.post('/coupons', validateCoupon, handleValidationErrors, createSellerCoupon);
router.put('/coupons/:id', validateCoupon, handleValidationErrors, updateSellerCoupon);
router.delete('/coupons/:id', deleteSellerCoupon);

router.get('/settings', getSellerSettings);
router.put('/settings', updateSellerProfile);

module.exports = router;