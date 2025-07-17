const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const seedOrders = async () => {
  try {
    await connectDB();
    
    console.log('Creating sample orders...');
    
    // Get existing users and products
    const admin = await User.findOne({ role: 'admin' });
    const seller = await User.findOne({ role: 'seller' });
    const products = await Product.find().limit(3);
    
    if (!admin || !seller || products.length === 0) {
      console.log('Please run seedData.js first to create users and products');
      process.exit(1);
    }
    
    // Create sample customer
    const customer = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer',
      isActive: true,
      isVerified: true
    });
    
    // Sample orders data
    const sampleOrders = [
      {
        user: customer._id,
        items: [
          {
            product: products[0]._id,
            seller: seller._id,
            quantity: 2,
            price: products[0].price,
            total: products[0].price * 2,
            status: 'delivered'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer@example.com',
          phone: '+977-9841234567',
          street: 'Thamel Street',
          city: 'Kathmandu',
          district: 'Kathmandu',
          postalCode: '44600',
          country: 'Nepal'
        },
        paymentInfo: {
          method: 'esewa',
          status: 'paid',
          transactionId: 'ESW123456789',
          paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        orderStatus: 'delivered',
        subtotal: products[0].price * 2,
        shippingCost: 100,
        tax: (products[0].price * 2) * 0.13,
        discount: 0,
        totalAmount: (products[0].price * 2) + 100 + ((products[0].price * 2) * 0.13),
        actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        user: customer._id,
        items: [
          {
            product: products[1]._id,
            seller: seller._id,
            quantity: 1,
            price: products[1].price,
            total: products[1].price,
            status: 'delivered'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer@example.com',
          phone: '+977-9841234567',
          street: 'Thamel Street',
          city: 'Kathmandu',
          district: 'Kathmandu',
          postalCode: '44600',
          country: 'Nepal'
        },
        paymentInfo: {
          method: 'khalti',
          status: 'paid',
          transactionId: 'KHT987654321',
          paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        orderStatus: 'delivered',
        subtotal: products[1].price,
        shippingCost: 0, // Free shipping
        tax: products[1].price * 0.13,
        discount: 50,
        totalAmount: products[1].price + (products[1].price * 0.13) - 50,
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        user: customer._id,
        items: [
          {
            product: products[2]._id,
            seller: seller._id,
            quantity: 3,
            price: products[2].price,
            total: products[2].price * 3,
            status: 'processing'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer@example.com',
          phone: '+977-9841234567',
          street: 'Thamel Street',
          city: 'Kathmandu',
          district: 'Kathmandu',
          postalCode: '44600',
          country: 'Nepal'
        },
        paymentInfo: {
          method: 'cash_on_delivery',
          status: 'pending'
        },
        orderStatus: 'processing',
        subtotal: products[2].price * 3,
        shippingCost: 100,
        tax: (products[2].price * 3) * 0.13,
        discount: 0,
        totalAmount: (products[2].price * 3) + 100 + ((products[2].price * 3) * 0.13),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      // Add more orders from different time periods
      {
        user: customer._id,
        items: [
          {
            product: products[0]._id,
            seller: seller._id,
            quantity: 1,
            price: products[0].price,
            total: products[0].price,
            status: 'delivered'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer@example.com',
          phone: '+977-9841234567',
          street: 'Thamel Street',
          city: 'Kathmandu',
          district: 'Kathmandu',
          postalCode: '44600',
          country: 'Nepal'
        },
        paymentInfo: {
          method: 'esewa',
          status: 'paid',
          transactionId: 'ESW111222333',
          paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        orderStatus: 'delivered',
        subtotal: products[0].price,
        shippingCost: 100,
        tax: products[0].price * 0.13,
        discount: 0,
        totalAmount: products[0].price + 100 + (products[0].price * 0.13),
        actualDelivery: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) // 18 days ago
      },
      {
        user: customer._id,
        items: [
          {
            product: products[1]._id,
            seller: seller._id,
            quantity: 2,
            price: products[1].price,
            total: products[1].price * 2,
            status: 'delivered'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer@example.com',
          phone: '+977-9841234567',
          street: 'Thamel Street',
          city: 'Kathmandu',
          district: 'Kathmandu',
          postalCode: '44600',
          country: 'Nepal'
        },
        paymentInfo: {
          method: 'khalti',
          status: 'paid',
          transactionId: 'KHT444555666',
          paidAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
        },
        orderStatus: 'delivered',
        subtotal: products[1].price * 2,
        shippingCost: 0,
        tax: (products[1].price * 2) * 0.13,
        discount: 100,
        totalAmount: (products[1].price * 2) + ((products[1].price * 2) * 0.13) - 100,
        actualDelivery: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) // 28 days ago
      }
    ];
    
    // Clear existing orders
    await Order.deleteMany({});
    
    // Create orders with proper order numbers
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
    }
    
    console.log(`Created ${sampleOrders.length} sample orders successfully!`);
    console.log('Sample Customer:', {
      email: customer.email,
      password: 'customer123'
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();