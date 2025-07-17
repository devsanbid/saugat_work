const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

const createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod = 'cash_on_delivery',
      notes
    } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .populate('appliedCoupon');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Validate stock availability
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product.name} is no longer available`
        });
      }
      
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available`
        });
      }
    }
    
    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
      status: 'pending'
    }));
    
    // Calculate order totals
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal >= 2000 ? 0 : 150; // Free shipping over Rs. 2000
    const tax = subtotal * 0.13; // 13% VAT
    const discount = cart.discountAmount;
    const totalAmount = subtotal + shippingCost + tax - discount;
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
      },
      subtotal,
      shippingCost,
      tax,
      discount,
      totalAmount,
      appliedCoupon: cart.appliedCoupon,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    // Update product stock and sold count
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity
        }
      });
    }
    
    // Mark coupon as used
    if (cart.appliedCoupon) {
      await cart.appliedCoupon.markAsUsed(req.user.id);
    }
    
    // Clear cart
    cart.items = [];
    cart.appliedCoupon = null;
    cart.totalAmount = 0;
    cart.discountAmount = 0;
    cart.finalAmount = 0;
    await cart.save();
    
    await order.populate([
      {
        path: 'items.product',
        select: 'name image price'
      },
      {
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      },
      {
        path: 'appliedCoupon',
        select: 'code discountType discountValue'
      }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.orderStatus = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('items.product', 'name image price')
      .populate('items.seller', 'firstName lastName sellerInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      orders
    });
    
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name image price sku')
      .populate('items.seller', 'firstName lastName sellerInfo.businessName')
      .populate('appliedCoupon', 'code discountType discountValue');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns this order or is admin/seller
    if (order.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        !order.items.some(item => item.seller.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && 
        !order.items.some(item => item.seller.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }
    
    order.orderStatus = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (status === 'shipped') {
      order.shippedAt = new Date();
      if (trackingNumber) {
        order.addTrackingUpdate('Order shipped', `Tracking number: ${trackingNumber}`);
      }
    }
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.addTrackingUpdate('Order delivered', 'Package delivered successfully');
    }
    
    if (notes) {
      order.notes = notes;
    }
    
    await order.save();
    
    await order.populate([
      {
        path: 'items.product',
        select: 'name image price'
      },
      {
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
    
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id)
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }
    
    if (!order.canBeCancelled) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    order.orderStatus = 'cancelled';
    order.cancelReason = reason;
    order.cancelledAt = new Date();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: item.quantity,
          soldCount: -item.quantity
        }
      });
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
    
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate, 
      search 
    } = req.query;
    
    let query = {};
    
    if (status) {
      query.orderStatus = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name image price')
      .populate('items.seller', 'firstName lastName sellerInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      orders
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {
      'items.seller': req.user.id
    };
    
    if (status) {
      query['items.status'] = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name image price sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Filter items to show only seller's products
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user.id
      );
      return {
        ...order.toObject(),
        items: sellerItems
      };
    });
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      orders: filteredOrders
    });
    
  } catch (error) {
    next(error);
  }
};

const getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = {};
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    
    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats.length > 0 ? stats[0] : {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };
    
    delete result._id;
    
    res.status(200).json({
      success: true,
      stats: result
    });
    
  } catch (error) {
    next(error);
  }
};

const addTrackingUpdate = async (req, res, next) => {
  try {
    const { status, description, location } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && 
        !order.items.some(item => item.seller.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.addTrackingUpdate(status, description, location);
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Tracking update added successfully',
      trackingUpdates: order.trackingUpdates
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Get all orders for this seller
    const orders = await Order.find({
      'items.seller': req.user.id
    })
    .populate('user', 'firstName lastName email phone createdAt')
    .sort({ createdAt: -1 });
    
    // Extract unique customers with their order statistics
    const customerMap = new Map();
    
    orders.forEach(order => {
      const customerId = order.user._id.toString();
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user.id
      );
      
      if (sellerItems.length > 0) {
        const itemTotal = sellerItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        
        if (customerMap.has(customerId)) {
          const existing = customerMap.get(customerId);
          existing.orders += 1;
          existing.totalSpent += itemTotal;
          existing.lastOrderDate = new Date(Math.max(
            new Date(existing.lastOrderDate),
            new Date(order.createdAt)
          ));
        } else {
          customerMap.set(customerId, {
            _id: order.user._id,
            name: `${order.user.firstName} ${order.user.lastName}`,
            email: order.user.email,
            phone: order.user.phone || 'N/A',
            joinedDate: order.user.createdAt,
            orders: 1,
            totalSpent: itemTotal,
            lastOrderDate: order.createdAt,
            isVip: false // Will be calculated based on spending
          });
        }
      }
    });
    
    // Convert map to array and calculate VIP status
    let customers = Array.from(customerMap.values());
    
    // Mark customers as VIP if they've spent more than 10000 or have more than 5 orders
    customers = customers.map(customer => ({
      ...customer,
      isVip: customer.totalSpent > 10000 || customer.orders > 5,
      rating: Math.min(5, Math.max(1, customer.orders * 0.5 + (customer.totalSpent / 5000)))
    }));
    
    // Apply search filter
    if (search) {
      customers = customers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by total spent (descending)
    customers.sort((a, b) => b.totalSpent - a.totalSpent);
    
    // Apply pagination
    const total = customers.length;
    const skip = (page - 1) * limit;
    const paginatedCustomers = customers.slice(skip, skip + Number(limit));
    
    res.status(200).json({
      success: true,
      count: paginatedCustomers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      customers: paginatedCustomers
    });
    
  } catch (error) {
    next(error);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({
      user: customerId,
      'items.seller': req.user.id
    })
    .populate('items.product', 'name image price sku')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
    
    // Filter items to show only seller's products
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user.id
      );
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        items: sellerItems,
        itemTotal: sellerItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        )
      };
    });
    
    const total = await Order.countDocuments({
      user: customerId,
      'items.seller': req.user.id
    });
    
    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      orders: filteredOrders
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getSellerOrders,
  getOrderStats,
  addTrackingUpdate,
  getSellerCustomers,
  getCustomerOrders
};