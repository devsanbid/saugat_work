const express = require('express');
const {
  getDashboardStats,
  getSystemHealth,
  getReports,
  getFinancialReports,
  manageUsers,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getSystemLogs,
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/adminController');
const {
  validateCoupon,
  validateAdminProfile,
  handleValidationErrors
} = require('../middleware/validation');
const { protect, checkAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/system/health', getSystemHealth);
router.get('/reports', getReports);
router.get('/financial-reports', getFinancialReports);
router.get('/logs', getSystemLogs);
router.post('/users/manage', manageUsers);

// Admin profile routes
router.get('/profile', getAdminProfile);
router.put('/profile', validateAdminProfile, updateAdminProfile);

router.get('/coupons', getAllCoupons);
router.post('/coupons', validateCoupon, handleValidationErrors, createCoupon);
router.put('/coupons/:id', validateCoupon, handleValidationErrors, updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;