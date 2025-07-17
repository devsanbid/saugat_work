const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  moveAllToCart,
  checkProductInWishlist,
  getWishlistSummary
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.get('/summary', getWishlistSummary);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.post('/move-to-cart/:productId', moveToCart);
router.post('/move-all-to-cart', moveAllToCart);
router.get('/check/:productId', checkProductInWishlist);

module.exports = router;