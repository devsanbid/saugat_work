const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  appliedCoupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.methods.calculateTotals = async function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  this.discountAmount = 0;
  if (this.appliedCoupon) {
    // If appliedCoupon is populated
    if (this.appliedCoupon.calculateDiscount) {
      this.discountAmount = this.appliedCoupon.calculateDiscount(this.totalAmount);
    } else {
      // If appliedCoupon is just an ObjectId, populate it
      await this.populate('appliedCoupon');
      if (this.appliedCoupon && this.appliedCoupon.calculateDiscount) {
        this.discountAmount = this.appliedCoupon.calculateDiscount(this.totalAmount);
      }
    }
  }
  
  this.finalAmount = Math.max(0, this.totalAmount - this.discountAmount);
  return this;
};

cartSchema.pre('save', async function(next) {
  await this.calculateTotals();
  next();
});

cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Cart', cartSchema);