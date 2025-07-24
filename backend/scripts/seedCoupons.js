const mongoose = require('mongoose');
require('dotenv').config();

const Coupon = require('../models/Coupon');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedCoupons = async () => {
  try {
    await connectDB();
    
    console.log('Creating sample coupons...');
    
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('Please run seedData.js first to create admin user');
      process.exit(1);
    }
    
    await Coupon.deleteMany({});
    
    const sampleCoupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 500,
        maximumDiscountAmount: 1000,
        usageLimit: 100,
        userUsageLimit: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'NEPAL20',
        description: 'Nepal special - 20% off on orders above Rs. 2000',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderAmount: 2000,
        maximumDiscountAmount: 2000,
        usageLimit: 50,
        userUsageLimit: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'FIXED100',
        description: 'Fixed discount - Rs. 100 off on any order',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderAmount: 1000,
        usageLimit: 200,
        userUsageLimit: 2,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdBy: admin._id
      },
      {
        code: 'TESTCOUPON',
        description: 'Test coupon for debugging - 5% off',
        discountType: 'percentage',
        discountValue: 5,
        minimumOrderAmount: 100,
        maximumDiscountAmount: 500,
        usageLimit: 1000,
        userUsageLimit: 5,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdBy: admin._id
      }
    ];
    
    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    
    console.log(`Created ${createdCoupons.length} sample coupons successfully!`);
    console.log('Available coupon codes:');
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.description}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();