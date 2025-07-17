const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getMainCategories,
  getCategoryStats
} = require('../controllers/categoryController');
const {
  validateCategory,
  handleValidationErrors
} = require('../middleware/validation');
const { protect, checkAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/main', getMainCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);
router.get('/:id/products', getCategoryProducts);
router.get('/:id/stats', getCategoryStats);

// Admin only routes
router.use(protect);
router.use(checkAdmin);

router.post('/', validateCategory, handleValidationErrors, createCategory);
router.put('/:id', validateCategory, handleValidationErrors, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;