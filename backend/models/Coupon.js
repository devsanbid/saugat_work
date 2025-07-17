const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  maximumDiscountAmount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1
  },
  applicableCategories: [{
    type: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  excludedCategories: [{
    type: String
  }],
  excludedProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderAmount: Number,
    discountAmount: Number
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

couponSchema.virtual('isNotStarted').get(function() {
  return new Date() < this.validFrom;
});

couponSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.isNotStarted;
});

couponSchema.virtual('remainingUses').get(function() {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.usedCount);
});

couponSchema.methods.canBeUsedBy = function(userId, orderAmount) {
  if (!this.isValid) return { valid: false, reason: 'Coupon is not valid' };
  
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit exceeded' };
  }
  
  if (orderAmount < this.minimumOrderAmount) {
    return { valid: false, reason: `Minimum order amount is Rs. ${this.minimumOrderAmount}` };
  }
  
  const userUsage = this.usedBy.filter(usage => 
    usage.user.toString() === userId.toString()
  ).length;
  
  if (userUsage >= this.userUsageLimit) {
    return { valid: false, reason: 'You have already used this coupon' };
  }
  
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
      discount = this.maximumDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }
  
  return Math.min(discount, orderAmount);
};

couponSchema.methods.markAsUsed = function(userId, orderAmount, discountAmount) {
  this.usedBy.push({
    user: userId,
    orderAmount,
    discountAmount
  });
  this.usedCount += 1;
  return this.save();
};

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ createdBy: 1 });
couponSchema.index({ seller: 1 });

module.exports = mongoose.model('Coupon', couponSchema);