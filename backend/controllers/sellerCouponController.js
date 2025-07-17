const Coupon = require('../models/Coupon');

const createSellerCoupon = async (req, res, next) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user.id,
      seller: req.user.id // Associate coupon with the seller
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

const updateSellerCoupon = async (req, res, next) => {
  try {
    // Find coupon and ensure it belongs to the seller
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      seller: req.user.id
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or you do not have permission to update it'
      });
    }
    
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: updatedCoupon
    });
    
  } catch (error) {
    next(error);
  }
};

const deleteSellerCoupon = async (req, res, next) => {
  try {
    // Find coupon and ensure it belongs to the seller
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      seller: req.user.id
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or you do not have permission to delete it'
      });
    }
    
    await Coupon.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const getSellerCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, isExpired } = req.query;
    
    let query = {
      seller: req.user.id // Only get coupons created by this seller
    };
    
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

const getSellerCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      seller: req.user.id
    }).populate('createdBy', 'firstName lastName');
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or you do not have permission to view it'
      });
    }
    
    res.status(200).json({
      success: true,
      coupon
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSellerCoupon,
  updateSellerCoupon,
  deleteSellerCoupon,
  getSellerCoupons,
  getSellerCouponById
};