const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/doko_ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });


    const adminEmail = process.env.ADMIN_EMAIL || 'admin@doko.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    console.log('Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isVerified: true,
      phone: '+977-9800000000',
      address: {
        street: 'Admin Street',
        city: 'Kathmandu',
        district: 'Kathmandu',
        postalCode: '44600',
        country: 'Nepal'
      }
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: ${adminUser.role}`);

    process.exit(0);

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
