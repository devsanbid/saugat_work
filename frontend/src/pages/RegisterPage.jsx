import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '.././context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useContext(AuthContext);
  
  const [selectedRole, setSelectedRole] = useState('customer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    district: '',
    zone: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

  const roles = [
    {
      id: 'customer',
      name: 'Customer',
      nepaliName: 'ग्राहक',
      icon: UserIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      description: 'Shop authentic Nepali products',
      requirements: ['Personal information', 'Email verification', 'Phone number'],
      benefits: ['Browse all products', 'Place orders', 'Track deliveries', 'Write reviews']
    },
    {
      id: 'seller',
      name: 'Seller',
      nepaliName: 'बिक्रेता',
      icon: ShoppingBagIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      description: 'Sell your authentic crafts',
      requirements: ['Business information', 'Identity verification', 'Bank details'],
      benefits: ['Sell products', 'Manage inventory', 'Track sales', 'Customer support']
    },
    {
      id: 'admin',
      name: 'Admin',
      nepaliName: 'प्रशासक',
      icon: CogIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      description: 'Manage the entire platform',
      requirements: ['Special authorization', 'Admin approval', 'Full verification'],
      benefits: ['User management', 'Platform analytics', 'Content moderation', 'System settings']
    }
  ];

  const nepalDistricts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Pokhara', 'Butwal',
    'Biratnagar', 'Janakpur', 'Nepalgunj', 'Dharan', 'Hetauda', 'Itahari'
  ];

  const nepalZones = [
    'Central', 'Eastern', 'Western', 'Mid-Western', 'Far-Western'
  ];

  const businessTypes = [
    'Handicrafts', 'Musical Instruments', 'Textiles', 'Pottery', 'Woodwork', 
    'Metalwork', 'Jewelry', 'Food Products', 'Traditional Clothing', 'Other'
  ];

  const currentRole = roles.find(role => role.id === selectedRole);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Check password strength
    if (field === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('One special character');

    const strengthLevels = [
      { score: 0, text: 'Very Weak', color: 'text-red-600' },
      { score: 1, text: 'Weak', color: 'text-red-500' },
      { score: 2, text: 'Fair', color: 'text-yellow-500' },
      { score: 3, text: 'Good', color: 'text-blue-500' },
      { score: 4, text: 'Strong', color: 'text-green-500' },
      { score: 5, text: 'Very Strong', color: 'text-green-600' }
    ];

    setPasswordStrength(strengthLevels[score]);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validation
    if (selectedRole === 'seller') {
      if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
      if (!formData.businessType) errors.businessType = 'Business type is required';
      if (!formData.district) errors.district = 'District is required';
      if (!formData.zone) errors.zone = 'Zone is required';
    }

    if (selectedRole === 'admin') {
      errors.admin = 'Admin registration requires special authorization. Please contact support.';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: selectedRole,
          subscribeNewsletter: formData.subscribeNewsletter
        };

        // Add role-specific data
        if (selectedRole === 'seller') {
          registrationData.businessName = formData.businessName;
          registrationData.businessType = formData.businessType;
          registrationData.district = formData.district;
          registrationData.zone = formData.zone;
        }

        await register(registrationData);
        
        navigate('/login', { 
          replace: true,
          state: { 
            message: 'Registration successful! Please login to continue.',
            email: formData.email
          } 
        });
      } catch (err) {
        console.error('Registration error:', err);
        // Error is already handled in AuthContext
      }
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setFormData(prev => ({
      ...prev,
      businessName: '',
      businessType: '',
      district: '',
      zone: ''
    }));
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-3 rounded-full">
                <span className="text-white font-bold text-2xl">🧺</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Doko
                </h1>
                <p className="text-sm text-gray-600">Authentic Nepal</p>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Community! 🎉
            </h2>
            <p className="text-gray-600">
              खाता बनाउनुहोस् - Create your account and start your journey
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            {/* Role Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Select Your Role
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isDisabled = role.id === 'admin';
                  
                  return (
                    <div
                      key={role.id}
                      onClick={() => !isDisabled && handleRoleChange(role.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : selectedRole === role.id
                          ? `${role.borderColor} ${role.bgColor} transform scale-105 cursor-pointer`
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      <div className="text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${
                          selectedRole === role.id ? role.textColor : 'text-gray-600'
                        }`} />
                        <h4 className={`font-semibold mb-1 ${
                          selectedRole === role.id ? role.textColor : 'text-gray-900'
                        }`}>
                          {role.name}
                        </h4>
                        <p className={`text-sm ${
                          selectedRole === role.id ? role.textColor : 'text-gray-500'
                        }`}>
                          {role.nepaliName}
                        </p>
                      </div>
                      
                      {selectedRole === role.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircleIcon className={`h-5 w-5 ${role.textColor}`} />
                        </div>
                      )}
                      
                      {isDisabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
                          <span className="text-xs text-gray-500">Contact Support</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Info */}
            <div className={`${currentRole.bgColor} rounded-lg p-6 mb-8 border ${currentRole.borderColor}`}>
              <div className="flex items-center space-x-3 mb-4">
                <currentRole.icon className={`h-6 w-6 ${currentRole.textColor}`} />
                <div>
                  <h4 className={`text-lg font-semibold ${currentRole.textColor}`}>
                    Registering as {currentRole.name}
                  </h4>
                  <p className={`text-sm ${currentRole.textColor}`}>
                    {currentRole.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className={`font-medium mb-2 ${currentRole.textColor}`}>Requirements:</h5>
                  <ul className={`text-sm space-y-1 ${currentRole.textColor}`}>
                    {currentRole.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className={`font-medium mb-2 ${currentRole.textColor}`}>Benefits:</h5>
                  <ul className={`text-sm space-y-1 ${currentRole.textColor}`}>
                    {currentRole.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Admin Registration Note */}
            {selectedRole === 'admin' && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Admin registration requires special authorization. Please contact our support team at admin@doko.com.np
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={formErrors.firstName}
                    icon={UserIcon}
                    placeholder="Your first name"
                    variant="nepal"
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={formErrors.lastName}
                    icon={UserIcon}
                    placeholder="Your last name"
                    variant="nepal"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={formErrors.email}
                    icon={EnvelopeIcon}
                    placeholder="your.email@example.com"
                    variant="nepal"
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={formErrors.phone}
                    icon={PhoneIcon}
                    placeholder="98XXXXXXXX"
                    variant="nepal"
                    required
                  />
                </div>
              </div>

              {/* Seller-specific Information */}
              {selectedRole === 'seller' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Business Name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      error={formErrors.businessName}
                      icon={ShoppingBagIcon}
                      placeholder="Your business name"
                      variant="nepal"
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Select Business Type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {formErrors.businessType && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.businessType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Select District</option>
                        {nepalDistricts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      {formErrors.district && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.district}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zone <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.zone}
                        onChange={(e) => handleInputChange('zone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Select Zone</option>
                        {nepalZones.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                      {formErrors.zone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.zone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Password - Fixed the duplicate eye button bug */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Create a strong password"
                        required
                      />
                      <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Confirm your password"
                        required
                      />
                      <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Password Strength:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 1 ? 'bg-red-500' :
                          passwordStrength.score <= 2 ? 'bg-yellow-500' :
                          passwordStrength.score <= 3 ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                  />
                  <div className="text-sm">
                    <span className="text-gray-700">I agree to the </span>
                    <Link to="/terms" className="text-red-600 hover:text-red-700 font-medium">
                      Terms and Conditions
                    </Link>
                    <span className="text-gray-700"> and </span>
                    <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                {formErrors.agreeToTerms && (
                  <p className="text-sm text-red-600">{formErrors.agreeToTerms}</p>
                )}

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Subscribe to our newsletter for updates on new authentic Nepali products and special offers
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="nepal"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading || selectedRole === 'admin'}
                className={`bg-gradient-to-r ${currentRole.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                {isLoading ? 'Creating Account...' : `Create ${currentRole.name} Account`}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              🎁 Why Join Doko?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🇳🇵</div>
                <div className="text-sm font-medium text-gray-900">Authentic Products</div>
                <div className="text-xs text-gray-600">100% genuine Nepali crafts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <div className="text-sm font-medium text-gray-900">Fast Delivery</div>
                <div className="text-xs text-gray-600">Quick delivery across Nepal</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-sm font-medium text-gray-900">Fair Prices</div>
                <div className="text-xs text-gray-600">Direct from artisans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="text-sm font-medium text-gray-900">Support Artisans</div>
                <div className="text-xs text-gray-600">Help preserve culture</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
