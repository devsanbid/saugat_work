const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@doko.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true,
      isVerified: true
    });
    
    console.log('Creating categories...');
    const categories = [
      {
        id: 'handicrafts',
        name: 'Handicrafts',
        nepaliName: 'हस्तकला',
        description: 'Traditional Nepali handicrafts and artworks',
        icon: 'craft',
        image: '/images/categories/handicrafts.jpg',
        subcategories: [
          { id: 'pottery', name: 'Pottery', nepaliName: 'माटोका भाँडा' },
          { id: 'woodcarving', name: 'Wood Carving', nepaliName: 'काठको नक्काशी' },
          { id: 'metalwork', name: 'Metal Work', nepaliName: 'धातुको काम' }
        ],
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'textiles',
        name: 'Textiles',
        nepaliName: 'कपडा',
        description: 'Traditional fabrics and clothing',
        icon: 'textile',
        image: '/images/categories/textiles.jpg',
        subcategories: [
          { id: 'dhaka', name: 'Dhaka Fabric', nepaliName: 'ढाका कपडा' },
          { id: 'pashmina', name: 'Pashmina', nepaliName: 'पश्मिना' },
          { id: 'traditional-clothing', name: 'Traditional Clothing', nepaliName: 'परम्परागत पोशाक' }
        ],
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'jewelry',
        name: 'Jewelry',
        nepaliName: 'गहना',
        description: 'Traditional and modern jewelry',
        icon: 'jewelry',
        image: '/images/categories/jewelry.jpg',
        subcategories: [
          { id: 'silver', name: 'Silver Jewelry', nepaliName: 'चाँदीका गहना' },
          { id: 'gold', name: 'Gold Jewelry', nepaliName: 'सुनका गहना' },
          { id: 'beads', name: 'Bead Jewelry', nepaliName: 'मोतीका गहना' }
        ],
        isActive: true,
        sortOrder: 3
      },
      {
        id: 'home-decor',
        name: 'Home Decor',
        nepaliName: 'घर सजावट',
        description: 'Decorative items for home',
        icon: 'home',
        image: '/images/categories/home-decor.jpg',
        subcategories: [
          { id: 'statues', name: 'Statues', nepaliName: 'मूर्तिहरू' },
          { id: 'paintings', name: 'Paintings', nepaliName: 'चित्रकला' },
          { id: 'carpets', name: 'Carpets', nepaliName: 'कार्पेट' }
        ],
        isActive: true,
        sortOrder: 4
      },
      {
        id: 'food-products',
        name: 'Food Products',
        nepaliName: 'खाद्य पदार्थ',
        description: 'Traditional and organic food products',
        icon: 'food',
        image: '/images/categories/food.jpg',
        subcategories: [
          { id: 'spices', name: 'Spices', nepaliName: 'मसला' },
          { id: 'tea', name: 'Tea', nepaliName: 'चिया' },
          { id: 'honey', name: 'Honey', nepaliName: 'मह' }
        ],
        isActive: true,
        sortOrder: 5
      },
      {
        id: 'musical-instruments',
        name: 'Musical Instruments',
        nepaliName: 'संगीत वाद्ययन्त्र',
        description: 'Traditional Nepali musical instruments',
        icon: 'music',
        image: '/images/categories/instruments.jpg',
        subcategories: [
          { id: 'drums', name: 'Drums', nepaliName: 'ढोल' },
          { id: 'flutes', name: 'Flutes', nepaliName: 'बाँसुरी' },
          { id: 'string-instruments', name: 'String Instruments', nepaliName: 'तारका बाजा' }
        ],
        isActive: true,
        sortOrder: 6
      }
    ];
    
    const createdCategories = await Category.insertMany(categories);
    
    console.log('Creating sample seller...');
    const sampleSeller = await User.create({
      firstName: 'Raj',
      lastName: 'Sharma',
      email: 'seller@doko.com',
      password: 'seller123',
      role: 'seller',
      isActive: true,
      isVerified: true,
      sellerInfo: {
        businessName: 'Traditional Crafts Nepal',
        businessAddress: 'Thamel, Kathmandu',
        businessPhone: '+977-1-4567890',
        businessEmail: 'info@traditionalcrafts.com',
        businessDescription: 'We specialize in authentic Nepali handicrafts and traditional items.',
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: adminUser._id,
        rating: 4.5,
        totalSales: 150
      }
    });
    
    console.log('Creating sample products...');
    const sampleProducts = [
      {
        name: 'Traditional Nepali Dhaka Topi',
        description: 'Authentic handmade Dhaka topi, a traditional Nepali cap worn during festivals and special occasions.',
        price: 500,
        salePrice: 450,
        image: '/images/products/dhaka-topi.jpg',
        category: createdCategories.find(cat => cat.id === 'textiles')._id,
        subcategory: 'traditional-clothing',
        sku: 'DHAKA-TOPI-001',
        stock: 25,
        seller: sampleSeller._id,
        artisan: 'Ram Bahadur Tamang',
        district: 'Bhaktapur',
        tags: ['traditional', 'festival', 'dhaka', 'cap'],
        specifications: {
          material: 'Cotton and Silk',
          size: 'One Size Fits All',
          color: 'Traditional Dhaka Pattern',
          weight: '50g'
        },
        isActive: true,
        isFeatured: true,
        isAuthentic: true,
        rating: 4.8,
        reviewCount: 12,
        soldCount: 45
      },
      {
        name: 'Handcrafted Singing Bowl',
        description: 'Authentic Tibetan singing bowl handcrafted by skilled artisans. Perfect for meditation and healing.',
        price: 2500,
        image: '/images/products/singing-bowl.jpg',
        category: createdCategories.find(cat => cat.id === 'handicrafts')._id,
        subcategory: 'metalwork',
        sku: 'BOWL-SING-001',
        stock: 15,
        seller: sampleSeller._id,
        artisan: 'Tenzin Norbu',
        district: 'Kathmandu',
        tags: ['meditation', 'healing', 'tibetan', 'bowl'],
        specifications: {
          material: 'Seven Metal Alloy',
          diameter: '12 cm',
          weight: '400g',
          includes: 'Wooden Striker and Cushion'
        },
        isActive: true,
        isFeatured: true,
        isAuthentic: true,
        rating: 4.9,
        reviewCount: 8,
        soldCount: 23
      },
      {
        name: 'Organic Himalayan Honey',
        description: 'Pure organic honey harvested from the high altitudes of the Himalayas. Rich in natural enzymes and minerals.',
        price: 800,
        salePrice: 720,
        image: '/images/products/himalayan-honey.jpg',
        category: createdCategories.find(cat => cat.id === 'food-products')._id,
        subcategory: 'honey',
        sku: 'HONEY-HIM-500G',
        stock: 50,
        seller: sampleSeller._id,
        artisan: 'Bee Farmers Cooperative',
        district: 'Dolakha',
        tags: ['organic', 'himalayan', 'honey', 'natural'],
        specifications: {
          weight: '500g',
          source: 'Wild Himalayan Flowers',
          altitude: '3000m+',
          purity: '100% Pure'
        },
        isActive: true,
        isFeatured: false,
        isAuthentic: true,
        rating: 4.7,
        reviewCount: 15,
        soldCount: 67
      }
    ];
    
    await Product.insertMany(sampleProducts);
    
    console.log('Seed data created successfully!');
    console.log('Admin User:', {
      email: adminUser.email,
      password: 'admin123'
    });
    console.log('Sample Seller:', {
      email: sampleSeller.email,
      password: 'seller123'
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();