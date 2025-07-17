const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

wishlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

wishlistSchema.methods.addItem = function(productId) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (!existingItem) {
    this.items.push({ product: productId });
  }
  
  return this.save();
};

wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return this.save();
};

wishlistSchema.methods.isInWishlist = function(productId) {
  return this.items.some(item => 
    item.product.toString() === productId.toString()
  );
};

wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);