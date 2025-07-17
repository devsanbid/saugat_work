const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  shippedAt: Date,
  deliveredAt: Date
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'Nepal'
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: String
  },
  notes: String,
  cancelReason: String,
  returnReason: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingUpdates: [{
    status: String,
    message: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('itemCount').get(function() {
  return this.items && this.items.length > 0 ? this.items.reduce((total, item) => total + item.quantity, 0) : 0;
});

orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.orderStatus);
});

orderSchema.virtual('canBeReturned').get(function() {
  return this.orderStatus === 'delivered' && 
         this.actualDelivery && 
         (Date.now() - this.actualDelivery.getTime()) <= (7 * 24 * 60 * 60 * 1000); // 7 days
});

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.orderNumber = 'DOKO' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

orderSchema.methods.addTrackingUpdate = function(status, message, location) {
  this.trackingUpdates.push({
    status,
    message,
    location
  });
  return this.save();
};

orderSchema.methods.updateStatus = function(newStatus) {
  this.orderStatus = newStatus;
  
  this.items.forEach(item => {
    if (['shipped', 'delivered', 'cancelled'].includes(newStatus)) {
      item.status = newStatus;
      if (newStatus === 'shipped') {
        item.shippedAt = new Date();
      } else if (newStatus === 'delivered') {
        item.deliveredAt = new Date();
        this.actualDelivery = new Date();
      }
    }
  });
  
  return this.save();
};

orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.seller': 1 });

module.exports = mongoose.model('Order', orderSchema);