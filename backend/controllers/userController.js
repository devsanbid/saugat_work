const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role = 'customer', phone, businessName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phone
    };
    
    if (role === 'seller' && businessName) {
      userData.sellerInfo = {
        businessName,
        isApproved: false
      };
    }
    
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive, search, excludeAdmin } = req.query;
    
    let query = {};
    
    if (excludeAdmin === 'true') {
      if (role && role !== 'all' && role !== 'admin') {
        query.role = role;
      } else {
        query.role = { $ne: 'admin' };
      }
    } else if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      users
    });
    
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, role, ...updateData } = req.body;
    
    // Only admin can update role
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update user role'
      });
    }
    
    // Users can only update their own profile (except admin)
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (role) updateData.role = role;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user: updatedUser
    });
    
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user has active orders
    const activeOrders = await Order.countDocuments({
      user: req.params.id,
      orderStatus: { $in: ['pending', 'processing', 'shipped'] }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active orders'
      });
    }
    
    // If seller, check if they have active products
    if (user.role === 'seller') {
      const activeProducts = await Product.countDocuments({
        seller: req.params.id,
        isActive: true
      });
      
      if (activeProducts > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete seller with active products'
        });
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { password, role, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let stats = {
      totalOrders: 0,
      totalSpent: 0,
      completedOrders: 0,
      pendingOrders: 0
    };
    
    if (user.role === 'customer') {
      const orderStats = await Order.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' },
            completedOrders: {
              $sum: {
                $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0]
              }
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  { $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'shipped']] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);
      
      if (orderStats.length > 0) {
        stats = orderStats[0];
        delete stats._id;
      }
    } else if (user.role === 'seller') {
      const productStats = await Product.aggregate([
        { $match: { seller: user._id } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: ['$isActive', 1, 0] }
            },
            totalSold: { $sum: '$soldCount' },
            totalRevenue: {
              $sum: { $multiply: ['$price', '$soldCount'] }
            }
          }
        }
      ]);
      
      stats = productStats.length > 0 ? productStats[0] : {
        totalProducts: 0,
        activeProducts: 0,
        totalSold: 0,
        totalRevenue: 0
      };
      delete stats._id;
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      },
      stats
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    
    // Get seller stats
    const productStats = await Product.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          totalSold: { $sum: '$soldCount' },
          totalRevenue: {
            $sum: { $multiply: ['$price', '$soldCount'] }
          }
        }
      }
    ]);
    
    const stats = productStats.length > 0 ? productStats[0] : {
      totalProducts: 0,
      activeProducts: 0,
      totalSold: 0,
      totalRevenue: 0
    };
    delete stats._id;
    
    // Get customer count from orders
    const customerStats = await Order.aggregate([
      { $match: { 'items.seller': new mongoose.Types.ObjectId(sellerId) } },
      { $group: { _id: '$user' } },
      { $count: 'totalCustomers' }
    ]);
    
    stats.totalCustomers = customerStats.length > 0 ? customerStats[0].totalCustomers : 0;
    
    // Get recent orders for this seller
    const recentOrders = await Order.find({
      'items.seller': new mongoose.Types.ObjectId(sellerId)
    })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name image price')
    .sort({ createdAt: -1 })
    .limit(5);
    
    // Filter and format orders to show only seller's items
    const formattedOrders = recentOrders.map(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === sellerId
      );
      
      const orderTotal = sellerItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
      
      return {
        _id: order._id,
        id: order.orderNumber,
        customer: {
          firstName: order.user.firstName,
          lastName: order.user.lastName
        },
        totalAmount: orderTotal,
        status: order.orderStatus,
        createdAt: order.createdAt
      };
    });
    
    // Get top selling products for this seller
    const topProducts = await Product.find({ 
      seller: new mongoose.Types.ObjectId(sellerId),
      isActive: true 
    })
    .sort({ soldCount: -1 })
    .limit(5)
    .select('name price stock soldCount averageRating reviewCount');
    
    const formattedTopProducts = topProducts.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      rating: product.averageRating || 0,
      reviews: product.reviewCount || 0
    }));
    
    res.status(200).json({
      success: true,
      stats,
      recentOrders: formattedOrders,
      topProducts: formattedTopProducts
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const { timeRange = 'month' } = req.query;
    
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default: // month
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Get current period stats
    const currentPeriodOrders = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: startDate },
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: '$items.quantity' }
        }
      }
    ]);
    
    const currentStats = currentPeriodOrders.length > 0 ? currentPeriodOrders[0] : {
      totalRevenue: 0,
      totalOrders: 0,
      totalItems: 0
    };
    
    // Get previous period for comparison
    let previousStartDate = new Date(startDate);
    let previousEndDate = new Date(startDate);
    const periodDays = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24));
    previousStartDate.setDate(previousStartDate.getDate() - periodDays);
    
    const previousPeriodOrders = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: previousStartDate, $lt: previousEndDate },
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 }
        }
      }
    ]);
    
    const previousStats = previousPeriodOrders.length > 0 ? previousPeriodOrders[0] : {
      totalRevenue: 0,
      totalOrders: 0
    };
    
    // Calculate trends
    const salesTrend = previousStats.totalRevenue > 0 
      ? ((currentStats.totalRevenue - previousStats.totalRevenue) / previousStats.totalRevenue) * 100
      : currentStats.totalRevenue > 0 ? 100 : 0;
    
    const averageOrderValue = currentStats.totalOrders > 0 
      ? currentStats.totalRevenue / currentStats.totalOrders 
      : 0;
    
    // Get sales by category
    const categoryStats = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: startDate },
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);
    
    const totalCategoryRevenue = categoryStats.reduce((sum, cat) => sum + cat.revenue, 0);
    const topCategories = categoryStats.map((cat, index) => ({
      name: cat._id,
      percentage: totalCategoryRevenue > 0 ? Math.round((cat.revenue / totalCategoryRevenue) * 100) : 0,
      value: `Rs ${cat.revenue.toLocaleString()}`,
      color: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][index] || 'bg-gray-500'
    }));
    
    // Get monthly performance data
    const monthlyData = await Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
          orderStatus: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
          visitors: { $sum: 1 } // Placeholder - would need actual visitor tracking
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyData.map(data => ({
      month: monthNames[data._id.month - 1],
      sales: data.sales,
      orders: data.orders,
      visitors: data.visitors * 20 // Simulated visitor data
    }));
    
    // Get return rate (placeholder calculation)
    const returnRate = 2.1; // Would need actual return tracking
    const conversionRate = 3.2; // Would need actual visitor tracking
    
    // Get unique customers count
    const customerCount = await Order.distinct('user', {
      'items.seller': sellerId,
      createdAt: { $gte: startDate },
      orderStatus: { $in: ['delivered', 'processing', 'shipped'] }
    });

    res.status(200).json({
      success: true,
      data: {
        salesTrend: Math.round(salesTrend * 10) / 10,
        conversionRate,
        averageOrderValue: Math.round(averageOrderValue),
        returnRate,
        topCategories,
        monthlyData: formattedMonthlyData,
        totalRevenue: currentStats.totalRevenue,
        totalOrders: currentStats.totalOrders,
        totalCustomers: customerCount.length
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { role: 'seller' };
    
    if (status === 'pending') {
      // Only return truly pending applications - not approved and no rejection reason
      query['sellerInfo.isApproved'] = false;
      query['sellerInfo.rejectionReason'] = { $exists: false };
    } else if (status === 'approved') {
      query['sellerInfo.isApproved'] = true;
    } else if (status === 'rejected') {
      query['sellerInfo.isApproved'] = false;
      query['sellerInfo.rejectionReason'] = { $exists: true };
    }
    
    const skip = (page - 1) * limit;
    
    const sellers = await User.find(query)
      .select('-password')
      .sort({ 'sellerInfo.appliedAt': -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: sellers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      sellers
    });
    
  } catch (error) {
    next(error);
  }
};

const approveSellerApplication = async (req, res, next) => {
  try {
    const { approved, rejectionReason } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.role !== 'seller') {
      return res.status(400).json({
        success: false,
        message: 'User is not a seller'
      });
    }
    
    // Check if application has already been processed
    if (user.sellerInfo.isApproved || user.sellerInfo.rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Seller application has already been processed'
      });
    }
    
    user.sellerInfo.isApproved = approved;
    
    if (approved) {
      user.sellerInfo.approvedAt = new Date();
      user.sellerInfo.approvedBy = req.user.id;
    } else {
      // For rejection, set rejection reason and timestamp
      user.sellerInfo.rejectionReason = rejectionReason || 'No reason provided';
      user.sellerInfo.rejectedAt = new Date();
      user.sellerInfo.rejectedBy = req.user.id;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `Seller application ${approved ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        sellerInfo: user.sellerInfo
      }
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerSettings = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    
    const seller = await User.findById(sellerId).select('-password');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    if (seller.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only sellers can access settings.'
      });
    }
    
    const settings = {
      profile: {
        storeName: seller.sellerInfo?.businessName || '',
        firstName: seller.firstName || '',
        lastName: seller.lastName || '',
        ownerName: `${seller.firstName} ${seller.lastName}`,
        email: seller.email,
        phone: seller.phone || '',
        address: seller.address || '',
        description: seller.sellerInfo?.description || '',
        websiteUrl: seller.sellerInfo?.websiteUrl || '',
        logo: seller.sellerInfo?.logo || ''
      },
      notifications: {
        orderNotifications: seller.notificationSettings?.orderNotifications ?? true,
        emailAlerts: seller.notificationSettings?.emailAlerts ?? true,
        smsAlerts: seller.notificationSettings?.smsAlerts ?? false,
        marketingEmails: seller.notificationSettings?.marketingEmails ?? true
      }
    };
    
    res.status(200).json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    next(error);
  }
};

const updateSellerProfile = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const { profile, notifications, currentPassword, newPassword } = req.body;
    
    const seller = await User.findById(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    if (seller.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only sellers can update settings.'
      });
    }
    
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, seller.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      const saltRounds = 12;
      seller.password = await bcrypt.hash(newPassword, saltRounds);
    }
    
    if (profile) {
      if (profile.storeName) {
        seller.sellerInfo = seller.sellerInfo || {};
        seller.sellerInfo.businessName = profile.storeName;
      }
      if (profile.firstName) seller.firstName = profile.firstName;
      if (profile.lastName) seller.lastName = profile.lastName;
      if (profile.phone) seller.phone = profile.phone;
      if (profile.address) seller.address = profile.address;
      if (profile.description) {
        seller.sellerInfo = seller.sellerInfo || {};
        seller.sellerInfo.description = profile.description;
      }
      if (profile.websiteUrl) {
        seller.sellerInfo = seller.sellerInfo || {};
        seller.sellerInfo.websiteUrl = profile.websiteUrl;
      }
      if (profile.logo) {
        seller.sellerInfo = seller.sellerInfo || {};
        seller.sellerInfo.logo = profile.logo;
      }
    }
    
    if (notifications) {
      seller.notificationSettings = {
        orderNotifications: notifications.orderNotifications ?? true,
        emailAlerts: notifications.emailAlerts ?? true,
        smsAlerts: notifications.smsAlerts ?? false,
        marketingEmails: notifications.marketingEmails ?? true
      };
    }
    
    await seller.save();
    
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        profile: {
          storeName: seller.sellerInfo?.businessName || '',
          firstName: seller.firstName || '',
          lastName: seller.lastName || '',
          ownerName: `${seller.firstName} ${seller.lastName}`,
          email: seller.email,
          phone: seller.phone || '',
          address: seller.address || '',
          description: seller.sellerInfo?.description || '',
          websiteUrl: seller.sellerInfo?.websiteUrl || '',
          logo: seller.sellerInfo?.logo || ''
        },
        notifications: seller.notificationSettings
      }
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getSellerDashboard,
  getSellerAnalytics,
  toggleUserStatus,
  getSellerApplications,
  approveSellerApplication,
  getSellerSettings,
  updateSellerProfile
};