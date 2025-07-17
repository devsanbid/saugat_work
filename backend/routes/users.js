const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
  toggleUserStatus,
  getSellerApplications,
  approveSellerApplication
} = require('../controllers/userController');
const { protect, authorize, checkAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes (accessible by the user themselves)
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/stats', getUserStats);
router.get('/stats/:id', getUserStats);

// Admin only routes
router.post('/', checkAdmin, createUser);
router.get('/', checkAdmin, getAllUsers);
router.get('/seller-applications', checkAdmin, getSellerApplications);
router.put('/seller-applications/:id/approve', checkAdmin, approveSellerApplication);
router.put('/:id/toggle-status', checkAdmin, toggleUserStatus);

// Routes accessible by admin or the user themselves
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;