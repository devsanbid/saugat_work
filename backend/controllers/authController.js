const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  const userResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVip: user.isVip,
    preferences: user.preferences,
    createdAt: user.createdAt
  };
  
  if (user.role === 'seller' && user.sellerInfo) {
    userResponse.sellerInfo = {
      businessName: user.sellerInfo.businessName,
      isApproved: user.sellerInfo.isApproved,
      rating: user.sellerInfo.rating
    };
  }
  
  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse
  });
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role = 'customer', phone, businessName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phone
    };
    
    if (role === 'seller' && businessName) {
      userData.sellerInfo = {
        businessName,
        isApproved: false
      };
    }
    
    const user = await User.create(userData);
    
    sendTokenResponse(user, 201, res);
    
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials for this role'
      });
    }
    
    const isPasswordMatched = await user.matchPassword(password);
    
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      preferences: req.body.preferences
    };
    
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
    const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
    
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken
};