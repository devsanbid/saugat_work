const express = require('express');
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  searchProducts
} = require('../controllers/productController');
const {
  validateProduct,
  handleValidationErrors
} = require('../middleware/validation');
const { protect, authorize, checkSeller, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/reviews', protect, addProductReview);

// Seller and Admin routes
router.post('/', protect, checkSeller, validateProduct, handleValidationErrors, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;