const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price image stock isActive seller',
        populate: {
          path: 'seller',
          select: 'firstName lastName sellerInfo.businessName'
        }
      })
      .populate('appliedCoupon', 'code discountType discountValue');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    // Filter out inactive products
    cart.items = cart.items.filter(item => 
      item.product && item.product.isActive
    );
    
    // Recalculate totals
    await cart.calculateTotals();
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.stock} available in stock`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.salePrice || product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.salePrice || product.price
      });
    }
    
    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }
    
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.salePrice || product.price;
    
    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    cart.items.splice(itemIndex, 1);
    
    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully',
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.appliedCoupon = null;
    cart.totalAmount = 0;
    cart.discountAmount = 0;
    cart.finalAmount = 0;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
    
    if (!coupon.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is expired or not yet valid'
      });
    }
    
    if (!coupon.canBeUsedBy(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon or reached usage limit'
      });
    }
    
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    if (cart.totalAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minimumOrderAmount} required`
      });
    }
    
    cart.appliedCoupon = coupon._id;
    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate('appliedCoupon', 'code discountType discountValue');
    
    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      cart,
      discount: cart.discountAmount
    });
    
  } catch (error) {
    next(error);
  }
};

const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.appliedCoupon = null;
    await cart.calculateTotals();
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      select: 'name price image stock isActive seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Coupon removed successfully',
      cart
    });
    
  } catch (error) {
    next(error);
  }
};

const getCartSummary = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('appliedCoupon', 'code discountType discountValue');
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        summary: {
          itemCount: 0,
          totalAmount: 0,
          discountAmount: 0,
          finalAmount: 0,
          appliedCoupon: null
        }
      });
    }
    
    const summary = {
      itemCount: cart.itemCount,
      totalAmount: cart.totalAmount,
      discountAmount: cart.discountAmount,
      finalAmount: cart.finalAmount,
      appliedCoupon: cart.appliedCoupon
    };
    
    res.status(200).json({
      success: true,
      summary
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getCartSummary
};