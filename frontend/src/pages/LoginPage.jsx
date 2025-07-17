import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '.././context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useContext(AuthContext);
  
  const [selectedRole, setSelectedRole] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

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
      features: ['Browse products', 'Place orders', 'Track deliveries', 'Write reviews'],
      demoCredentials: { email: 'customer@doko.com', password: 'customer123' }
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
      features: ['Manage products', 'Process orders', 'Track sales', 'Customer support'],
      demoCredentials: { email: 'seller@doko.com', password: 'seller123' }
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
      features: ['User management', 'Platform analytics', 'Content moderation', 'System settings'],
      demoCredentials: { email: 'admin@doko.com', password: 'admin123' }
    }
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
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await login(formData.email, formData.password, selectedRole, formData.rememberMe);
        
        // Navigate based on actual user role from backend
        const userRole = response?.user?.role || selectedRole;
        const redirectPath = userRole === 'admin' ? '/admin' : 
                            userRole === 'seller' ? '/seller/dashboard' : '/user/products';
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('Login error:', err);
        // Error is already handled in AuthContext
      }
    }
  };

  const handleDemoLogin = (credentials) => {
    setFormData({
      email: credentials.email,
      password: credentials.password,
      rememberMe: false
    });
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setFormData({ email: '', password: '', rememberMe: false });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Cpath d='M40 0c22.091 0 40 17.909 40 40s-17.909 40-40 40S0 62.091 0 40 17.909 0 40 0z' fill='%23dc2626' fill-opacity='0.05'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
              Welcome Back! 🙏
            </h2>
            <p className="text-gray-600">
              स्वागतम्! Choose your role and sign in to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select Your Role
              </h3>
              <p className="text-gray-600">
                भूमिका छान्नुहोस् - Choose how you want to access Doko
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleChange(role.id)}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedRole === role.id
                        ? `${role.borderColor} ${role.bgColor} transform scale-105`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                        selectedRole === role.id ? 'bg-white' : role.bgColor
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          selectedRole === role.id ? role.textColor : 'text-gray-600'
                        }`} />
                      </div>
                      <h4 className={`text-lg font-semibold mb-1 ${
                        selectedRole === role.id ? role.textColor : 'text-gray-900'
                      }`}>
                        {role.name}
                      </h4>
                      <p className={`text-sm mb-2 ${
                        selectedRole === role.id ? role.textColor : 'text-gray-500'
                      }`}>
                        {role.nepaliName}
                      </p>
                      <p className={`text-xs ${
                        selectedRole === role.id ? role.textColor : 'text-gray-500'
                      }`}>
                        {role.description}
                      </p>
                    </div>
                    
                    {selectedRole === role.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircleIcon className={`h-5 w-5 ${role.textColor}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Role Info */}
            <div className={`${currentRole.bgColor} rounded-lg p-6 mb-8 border ${currentRole.borderColor}`}>
              <div className="flex items-center space-x-3 mb-4">
                <currentRole.icon className={`h-6 w-6 ${currentRole.textColor}`} />
                <div>
                  <h4 className={`text-lg font-semibold ${currentRole.textColor}`}>
                    Signing in as {currentRole.name}
                  </h4>
                  <p className={`text-sm ${currentRole.textColor}`}>
                    {currentRole.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {currentRole.features.map((feature, index) => (
                  <div key={index} className={`flex items-center space-x-2 text-sm ${currentRole.textColor}`}>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>{feature}</span>
                  </div>
                ))}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={formErrors.email}
                icon={EnvelopeIcon}
                placeholder="Enter your email"
                variant="nepal"
                required
              />

              {/* Password - Fixed the duplicate eye button bug */}
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="nepal"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className={`bg-gradient-to-r ${currentRole.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                {isLoading ? 'Signing in...' : `Sign In as ${currentRole.name}`}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                🚀 Demo Credentials for {currentRole.name}:
              </h4>
              <button
                onClick={() => handleDemoLogin(currentRole.demoCredentials)}
                className="w-full text-left p-3 bg-white rounded border border-gray-200 hover:border-yellow-300 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {currentRole.name} Demo Account
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentRole.demoCredentials.email}
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Click to use
                  </Badge>
                </div>
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Cultural Quote */}
          <div className="text-center px-4">
            <p className="text-sm text-gray-500 italic">
              "सत्यमेव जयते" - Truth alone triumphs
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Access Doko with your role-based account - Customer, Seller, or Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
