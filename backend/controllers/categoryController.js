const Category = require('../models/Category');
const Product = require('../models/Product');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
    
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    if (!category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category is not available'
      });
    }
    
    res.status(200).json({
      success: true,
      category
    });
    
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      category
    });
    
  } catch (error) {
    next(error);
  }
};

const getCategoryProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      isActive: true
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
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
    
    const products = await Product.find({
      category: category.id,
      isActive: true
    })
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments({
      category: category.id,
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      category,
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

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      category
    });
    
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      category
    });
    
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products associated with it.`
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const getMainCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      isActive: true,
      'subcategories.0': { $exists: true } // Categories that have subcategories
    })
      .sort({ sortOrder: 1, name: 1 })
      .limit(8);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
    
  } catch (error) {
    next(error);
  }
};

const getCategoryStats = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const productCount = await Product.countDocuments({
      category: req.params.id,
      isActive: true
    });
    
    const avgPrice = await Product.aggregate([
      {
        $match: {
          category: category._id,
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalSold: { $sum: '$soldCount' }
        }
      }
    ]);
    
    const stats = {
      productCount,
      avgPrice: avgPrice[0]?.avgPrice || 0,
      minPrice: avgPrice[0]?.minPrice || 0,
      maxPrice: avgPrice[0]?.maxPrice || 0,
      totalSold: avgPrice[0]?.totalSold || 0
    };
    
    res.status(200).json({
      success: true,
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      },
      stats
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getMainCategories,
  getCategoryStats
};