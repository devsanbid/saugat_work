const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price salePrice image stock isActive rating reviewCount seller',
        populate: {
          path: 'seller',
          select: 'firstName lastName sellerInfo.businessName'
        }
      });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }
    
    // Filter out inactive products
    wishlist.items = wishlist.items.filter(item => 
      item.product && item.product.isActive
    );
    
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      wishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
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
    
    const existingWishlist = await Wishlist.findOne({ 
      user: req.user.id,
      'items.product': productId
    });
    
    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }
    
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      {
        $addToSet: {
          items: {
            product: productId,
            addedAt: new Date()
          }
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    await wishlist.populate({
      path: 'items.product',
      select: 'name price salePrice image stock isActive rating reviewCount seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      wishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOneAndUpdate(
      { 
        user: req.user.id,
        'items.product': productId
      },
      {
        $pull: { items: { product: productId } }
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'items.product',
      select: 'name price salePrice image stock isActive rating reviewCount seller',
      populate: {
        path: 'seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found or product not in wishlist'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      wishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    wishlist.items = [];
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      wishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    
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
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    if (!wishlist.isInWishlist(productId)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }
    
    // Add to cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    const existingCartItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingCartItemIndex > -1) {
      const newQuantity = cart.items[existingCartItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.stock} available in stock`
        });
      }
      
      cart.items[existingCartItemIndex].quantity = newQuantity;
      cart.items[existingCartItemIndex].price = product.salePrice || product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.salePrice || product.price
      });
    }
    
    await cart.calculateTotals();
    await cart.save();
    
    // Remove from wishlist using atomic operation
    await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: productId } } }
    );
    
    // Get updated wishlist for response
    const updatedWishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price salePrice image stock isActive rating reviewCount seller',
        populate: {
          path: 'seller',
          select: 'firstName lastName sellerInfo.businessName'
        }
      });
    
    res.status(200).json({
      success: true,
      message: 'Product moved to cart successfully',
      wishlist: updatedWishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const moveAllToCart = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('items.product');
    
    if (!wishlist || wishlist.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Wishlist is empty'
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    const unavailableProducts = [];
    const addedProducts = [];
    
    for (const wishlistItem of wishlist.items) {
      const product = wishlistItem.product;
      
      if (!product.isActive || product.stock < 1) {
        unavailableProducts.push(product.name);
        continue;
      }
      
      const existingCartItemIndex = cart.items.findIndex(
        item => item.product.toString() === product._id.toString()
      );
      
      if (existingCartItemIndex > -1) {
        const newQuantity = cart.items[existingCartItemIndex].quantity + 1;
        
        if (newQuantity <= product.stock) {
          cart.items[existingCartItemIndex].quantity = newQuantity;
          cart.items[existingCartItemIndex].price = product.salePrice || product.price;
          addedProducts.push(product.name);
        } else {
          unavailableProducts.push(`${product.name} (insufficient stock)`);
        }
      } else {
        cart.items.push({
          product: product._id,
          quantity: 1,
          price: product.salePrice || product.price
        });
        addedProducts.push(product.name);
      }
    }
    
    await cart.calculateTotals();
    await cart.save();
    
    // Clear wishlist
    wishlist.items = [];
    await wishlist.save();
    
    let message = 'All available products moved to cart successfully';
    if (unavailableProducts.length > 0) {
      message += `. Unavailable products: ${unavailableProducts.join(', ')}`;
    }
    
    res.status(200).json({
      success: true,
      message,
      addedCount: addedProducts.length,
      unavailableCount: unavailableProducts.length,
      wishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const checkProductInWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        inWishlist: false
      });
    }
    
    const isInWishlist = wishlist.items.some(
      item => item.product.toString() === productId
    );
    
    res.status(200).json({
      success: true,
      inWishlist: isInWishlist
    });
    
  } catch (error) {
    next(error);
  }
};

const getWishlistSummary = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        summary: {
          itemCount: 0,
          totalValue: 0
        }
      });
    }
    
    await wishlist.populate('items.product', 'price salePrice');
    
    const totalValue = wishlist.items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price;
    }, 0);
    
    const summary = {
      itemCount: wishlist.itemCount,
      totalValue
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
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  moveAllToCart,
  checkProductInWishlist,
  getWishlistSummary
};