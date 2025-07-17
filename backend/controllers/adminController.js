const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

const getDashboardStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // User stats
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const activeSellers = await User.countDocuments({
      role: 'seller',
      'sellerInfo.isApproved': true,
      isActive: true
    });
    
    // Product stats
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const newProducts = await Product.countDocuments({
      createdAt: { $gte: startDate }
    });
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 },
      isActive: true
    });
    
    // Calculate total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);
    
    const totalInventoryValue = inventoryValue.length > 0 ? inventoryValue[0].totalValue : 0;
    
    // Order stats
    const totalOrders = await Order.countDocuments();
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });
    const pendingOrders = await Order.countDocuments({
      orderStatus: 'pending'
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: 'processing'
    });
    
    // Revenue stats
    const revenueStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);
    
    const revenue = revenueStats.length > 0 ? revenueStats[0] : {
      totalRevenue: 0,
      averageOrderValue: 0,
      orderCount: 0
    };
    
    // Category stats
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    
    // Top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(5)
      .select('name soldCount price image');
    
    // Recent orders
    const recentOrdersList = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber user totalAmount orderStatus createdAt');
    
    // Monthly revenue chart data
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          new: newUsers,
          sellers: totalSellers,
          activeSellers
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          new: newProducts,
          lowStock: lowStockProducts,
          totalValue: totalInventoryValue
        },
        orders: {
          total: totalOrders,
          recent: recentOrders,
          pending: pendingOrders,
          processing: processingOrders
        },
        revenue: {
          total: revenue.totalRevenue,
          average: revenue.averageOrderValue,
          orderCount: revenue.orderCount
        },
        categories: {
          total: totalCategories,
          active: activeCategories
        }
      },
      topProducts,
      recentOrders: recentOrdersList,
      monthlyRevenue
    });
    
  } catch (error) {
    next(error);
  }
};

const getSystemHealth = async (req, res, next) => {
  try {
    // Check database connection
    const dbStatus = 'connected'; // This would be more complex in real implementation
    
    // Check for critical issues
    const criticalIssues = [];
    
    // Check for low stock products
    const lowStockCount = await Product.countDocuments({
      stock: { $lte: 5 },
      isActive: true
    });
    
    if (lowStockCount > 0) {
      criticalIssues.push(`${lowStockCount} products with critically low stock`);
    }
    
    // Check for pending seller applications
    const pendingSellerApps = await User.countDocuments({
      role: 'seller',
      'sellerInfo.isApproved': false
    });
    
    if (pendingSellerApps > 0) {
      criticalIssues.push(`${pendingSellerApps} pending seller applications`);
    }
    
    // Check for old pending orders
    const oldPendingOrders = await Order.countDocuments({
      orderStatus: 'pending',
      createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (oldPendingOrders > 0) {
      criticalIssues.push(`${oldPendingOrders} orders pending for more than 24 hours`);
    }
    
    res.status(200).json({
      success: true,
      health: {
        database: dbStatus,
        criticalIssues,
        status: criticalIssues.length === 0 ? 'healthy' : 'needs_attention',
        lastChecked: new Date()
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    let matchQuery = {};
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    
    let report = {};
    
    switch (type) {
      case 'sales':
        report = await Order.aggregate([
          { $match: { ...matchQuery, orderStatus: { $in: ['delivered', 'processing', 'shipped'] } } },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              totalSales: { $sum: '$totalAmount' },
              orderCount: { $sum: 1 },
              averageOrderValue: { $avg: '$totalAmount' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        break;
        
      case 'products':
        report = await Product.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: '$category',
              productCount: { $sum: 1 },
              totalSold: { $sum: '$soldCount' },
              averagePrice: { $avg: '$price' },
              totalRevenue: { $sum: { $multiply: ['$price', '$soldCount'] } }
            }
          },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'categoryInfo'
            }
          },
          {
            $project: {
              categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] },
              productCount: 1,
              totalSold: 1,
              averagePrice: 1,
              totalRevenue: 1
            }
          }
        ]);
        break;
        
      case 'users':
        report = await User.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                role: '$role'
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type. Use: sales, products, or users'
        });
    }
    
    res.status(200).json({
      success: true,
      reportType: type,
      period: { startDate, endDate },
      data: report
    });
    
  } catch (error) {
    next(error);
  }
};

const manageUsers = async (req, res, next) => {
  try {
    const { action, userId } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    switch (action) {
      case 'activate':
        user.isActive = true;
        await user.save();
        break;
        
      case 'deactivate':
        user.isActive = false;
        await user.save();
        break;
        
      case 'promote_to_admin':
        if (user.role === 'admin') {
          return res.status(400).json({
            success: false,
            message: 'User is already an admin'
          });
        }
        user.role = 'admin';
        await user.save();
        break;
        
      case 'demote_from_admin':
        if (user.role !== 'admin') {
          return res.status(400).json({
            success: false,
            message: 'User is not an admin'
          });
        }
        user.role = 'customer';
        await user.save();
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${action} successfully`,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const coupon = await Coupon.create(couponData);
    
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
    
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
    
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, isExpired } = req.query;
    
    let query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (isExpired !== undefined) {
      const now = new Date();
      if (isExpired === 'true') {
        query.validUntil = { $lt: now };
      } else {
        query.validUntil = { $gte: now };
      }
    }
    
    const skip = (page - 1) * limit;
    
    const coupons = await Coupon.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Coupon.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: coupons.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      coupons
    });
    
  } catch (error) {
    next(error);
  }
};

const getSystemLogs = async (req, res, next) => {
  try {
    // This would typically fetch from a logging system
    // For now, we'll return recent activities
    
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('orderNumber user orderStatus createdAt');
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email role createdAt');
    
    const recentProducts = await Product.find()
      .populate('seller', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name seller isActive createdAt');
    
    const logs = {
      orders: recentOrders.map(order => ({
        type: 'order',
        action: `Order ${order.orderNumber} ${order.orderStatus}`,
        user: order.user.firstName + ' ' + order.user.lastName,
        timestamp: order.createdAt
      })),
      users: recentUsers.map(user => ({
        type: 'user',
        action: `New ${user.role} registered`,
        user: user.firstName + ' ' + user.lastName,
        timestamp: user.createdAt
      })),
      products: recentProducts.map(product => ({
        type: 'product',
        action: `Product ${product.name} ${product.isActive ? 'created' : 'deactivated'}`,
        user: product.seller.firstName + ' ' + product.seller.lastName,
        timestamp: product.createdAt
      }))
    };
    
    // Combine and sort all logs
    const allLogs = [...logs.orders, ...logs.users, ...logs.products]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);
    
    res.status(200).json({
      success: true,
      logs: allLogs
    });
    
  } catch (error) {
    next(error);
  }
};

const getFinancialReports = async (req, res, next) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;
    console.log('getFinancialReports called with:', { period, year });
    
    // Calculate date range based on period and year
    let startDate, endDate;
    const currentYear = parseInt(year);
    console.log('currentYear:', currentYear);
    
    switch (period) {
      case 'daily':
        startDate = new Date(currentYear, 0, 1); // Start of year
        endDate = new Date(currentYear, 11, 31); // End of year
        break;
      case 'weekly':
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        break;
      case 'monthly':
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        break;
      case 'quarterly':
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
        break;
      case 'yearly':
        startDate = new Date(currentYear - 5, 0, 1); // Last 5 years
        endDate = new Date(currentYear, 11, 31);
        break;
      default:
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
    }
    
    // Get financial summary
    const financialStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    const stats = financialStats.length > 0 ? financialStats[0] : {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    };
    console.log('financialStats:', financialStats);
    console.log('stats:', stats);
    
    // Calculate commission (assuming 10% platform commission)
    const commissionRate = 0.10;
    const totalCommission = stats.totalRevenue * commissionRate;
    const totalPayouts = stats.totalRevenue - totalCommission;
    const processingFees = stats.totalRevenue * 0.025; // 2.5% processing fees
    const netProfit = totalCommission - processingFees;
    console.log('calculated values:', { totalCommission, totalPayouts, processingFees, netProfit });
    
    // Get top sellers by revenue
    const topSellers = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.seller',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
          totalCommission: { $sum: { $multiply: [{ $multiply: ['$items.price', '$items.quantity'] }, commissionRate] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $project: {
          _id: 1,
          totalRevenue: 1,
          totalOrders: 1,
          totalCommission: 1,
          businessName: { $arrayElemAt: ['$sellerInfo.sellerInfo.businessName', 0] },
          firstName: { $arrayElemAt: ['$sellerInfo.firstName', 0] },
          lastName: { $arrayElemAt: ['$sellerInfo.lastName', 0] }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent transactions (using recent orders as transactions)
    const recentTransactions = await Order.find({
      orderStatus: { $in: ['delivered', 'processing', 'shipped', 'cancelled'] },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    })
    .populate('user', 'firstName lastName')
    .populate('items.seller', 'firstName lastName sellerInfo.businessName')
    .sort({ createdAt: -1 })
    .limit(20)
    .select('_id orderNumber totalAmount orderStatus createdAt user items');
    
    // Format transactions
    const formattedTransactions = recentTransactions.map(order => ({
      _id: order._id,
      id: order.orderNumber,
      type: order.orderStatus === 'delivered' ? 'Commission' : 
            order.orderStatus === 'cancelled' ? 'Refund' : 'Processing',
      amount: order.orderStatus === 'cancelled' ? -order.totalAmount : order.totalAmount * commissionRate,
      seller: order.items[0]?.seller?.sellerInfo?.businessName || 
              `${order.items[0]?.seller?.firstName} ${order.items[0]?.seller?.lastName}` || 'N/A',
      date: order.createdAt,
      status: order.orderStatus === 'delivered' ? 'completed' : 
              order.orderStatus === 'cancelled' ? 'refunded' : 'processing'
    }));
    
    const responseData = {
      summary: {
        totalRevenue: stats.totalRevenue,
        totalCommission: totalCommission,
        totalPayouts: totalPayouts,
        netProfit: netProfit
      },
      topSellers: topSellers,
      recentTransactions: formattedTransactions,
      period: period,
      year: year
    };
    console.log('Final response data:', responseData);
    
    res.status(200).json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    next(error);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    
    res.status(200).json({
      success: true,
      admin
    });
    
  } catch (error) {
    next(error);
  }
};

const updateAdminProfile = async (req, res, next) => {
  try {
    const { password, role, ...updateData } = req.body;
    
    // Prevent role changes through this endpoint
    if (role) {
      return res.status(400).json({
        success: false,
        message: 'Role cannot be updated through this endpoint'
      });
    }
    
    // Prevent password changes through this endpoint
    if (password) {
      return res.status(400).json({
        success: false,
        message: 'Password cannot be updated through this endpoint. Use change password endpoint.'
      });
    }
    
    const admin = await User.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    
    // Filter allowed fields for admin profile update
    const allowedFields = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      phone: updateData.phone,
      address: updateData.address,
      preferences: updateData.preferences
    };
    
    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });
    
    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.id,
      allowedFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      admin: updatedAdmin
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSystemHealth,
  getReports,
  getFinancialReports,
  manageUsers,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getSystemLogs,
  getAdminProfile,
  updateAdminProfile
};