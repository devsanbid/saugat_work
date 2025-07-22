const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      availability,
      isAuthentic,
      district,
      artisan,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (availability === 'in-stock') query.stock = { $gt: 0 };
    if (isAuthentic === 'true') query.isAuthentic = true;
    if (district) query.district = district;
    if (artisan) query.artisan = new RegExp(artisan, 'i');
    if (search) {
      query.$text = { $search: search };
    }
    
    const sortOptions = {};
    switch (sortBy) {
      case 'price':
        sortOptions.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'name':
        sortOptions.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'popular':
        sortOptions.soldCount = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('seller', 'firstName lastName sellerInfo.businessName sellerInfo.rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    });
    
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'firstName lastName sellerInfo.businessName sellerInfo.rating')
      .populate('reviews.user', 'firstName lastName avatar');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available'
      });
    }
    
    product.viewCount += 1;
    await product.save();
    
    res.status(200).json({
      success: true,
      product
    });
    
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
    
  } catch (error) {
    next(error);
  }
};

const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .limit(4)
      .sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });
    
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    req.body.seller = req.user.id;
    
    const sku = req.body.sku || `${req.body.category.toUpperCase()}-${Date.now()}`;
    req.body.sku = sku;
    
    const product = await Product.create(req.body);
    
    await product.populate('seller', 'firstName lastName sellerInfo.businessName');
    
    res.status(201).json({
      success: true,
      product
    });
    
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('seller', 'firstName lastName sellerInfo.businessName');
    
    res.status(200).json({
      success: true,
      product
    });
    
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };
    
    product.reviews.push(review);
    await product.save();
    
    await product.populate('reviews.user', 'firstName lastName avatar');
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      reviews: product.reviews
    });
    
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName avatar')
      .select('reviews rating reviewCount');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
      reviewCount: product.reviewCount
    });
    
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const query = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { artisan: { $regex: q, $options: 'i' } },
            { district: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    };
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .sort({ rating: -1, soldCount: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      query: q,
      products
    });
    
  } catch (error) {
    next(error);
  }
};

// Seller-specific function to get only their products
const getSellerProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      availability,
      isAuthentic,
      district,
      artisan,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;
    
    // Filter by current seller
    let query = { 
      seller: req.user.id,
      isActive: true 
    };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (availability === 'in-stock') query.stock = { $gt: 0 };
    if (isAuthentic === 'true') query.isAuthentic = true;
    if (district) query.district = district;
    if (artisan) query.artisan = new RegExp(artisan, 'i');
    if (search) {
      query.$text = { $search: search };
    }
    
    const sortOptions = {};
    switch (sortBy) {
      case 'price':
        sortOptions.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'name':
        sortOptions.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'popular':
        sortOptions.soldCount = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('seller', 'firstName lastName sellerInfo.businessName sellerInfo.rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  searchProducts,
  getSellerProducts
};