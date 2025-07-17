const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;