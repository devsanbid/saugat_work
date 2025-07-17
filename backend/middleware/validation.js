const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'seller'])
    .withMessage('Role must be either customer or seller'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory is required'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('artisan')
    .trim()
    .notEmpty()
    .withMessage('Artisan name is required'),
  
  body('district')
    .trim()
    .notEmpty()
    .withMessage('District is required'),
  
  handleValidationErrors
];

const validateCategory = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Category ID must contain only lowercase letters, numbers, and hyphens'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  
  body('nepaliName')
    .trim()
    .notEmpty()
    .withMessage('Nepali name is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('icon')
    .notEmpty()
    .withMessage('Icon is required'),
  
  handleValidationErrors
];

const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  
  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  
  body('shippingAddress.email')
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.district')
    .trim()
    .notEmpty()
    .withMessage('District is required'),
  
  body('paymentInfo.method')
    .isIn(['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  
  handleValidationErrors
];

const validateCoupon = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ max: 20 })
    .withMessage('Coupon code cannot exceed 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code must contain only uppercase letters and numbers'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be percentage or fixed'),
  
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from date must be a valid date'),
  
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until date must be a valid date'),
  
  handleValidationErrors
];

const validateAdminProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),
  
  body('address.district')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('District cannot exceed 100 characters'),
  
  body('address.postalCode')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Postal code cannot exceed 20 characters'),
  
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),
  
  body('preferences.newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be a boolean'),
  
  body('preferences.smsNotifications')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications preference must be a boolean'),
  
  body('preferences.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications preference must be a boolean'),
  
  body('preferences.orderUpdates')
    .optional()
    .isBoolean()
    .withMessage('Order updates preference must be a boolean'),
  
  // Prevent certain fields from being updated
  body('email')
    .not().exists()
    .withMessage('Email cannot be updated through this endpoint'),
  
  body('password')
    .not().exists()
    .withMessage('Password cannot be updated through this endpoint'),
  
  body('role')
    .not().exists()
    .withMessage('Role cannot be updated through this endpoint'),
  
  body('isActive')
    .not().exists()
    .withMessage('Account status cannot be updated through this endpoint'),
  
  body('isVerified')
    .not().exists()
    .withMessage('Verification status cannot be updated through this endpoint'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateCategory,
  validateOrder,
  validateCoupon,
  validateAdminProfile,
  handleValidationErrors
};