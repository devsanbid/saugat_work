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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

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
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
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
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          subscribeNewsletter: formData.subscribeNewsletter
        });
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } catch (err) {
        console.error('Registration error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
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
            Create your account and start exploring authentic Nepali products
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={formErrors.password}
                icon={LockClosedIcon}
                placeholder="Create a strong password"
                variant="nepal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="space-y-2">
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={formErrors.confirmPassword}
                icon={LockClosedIcon}
                placeholder="Confirm your password"
                variant="nepal"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Terms Agreement */}
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

            {/* Register Button */}
            <Button
              type="submit"
              variant="nepal"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🎁 Why Join Doko?
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Access to authentic Nepali products</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Fast delivery across Nepal</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Exclusive member discounts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Priority customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
