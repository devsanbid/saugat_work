import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CheckoutForm = ({ onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Delivery Address
    address: '',
    city: 'Kathmandu',
    district: 'Kathmandu',
    zone: 'Central',
    postalCode: '',
    landmark: '',
    
    // Additional Information
    deliveryNotes: '',
    paymentMethod: 'cod',
    
    // Terms and Conditions
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const nepalDistricts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Pokhara', 'Butwal',
    'Biratnagar', 'Janakpur', 'Nepalgunj', 'Dharan', 'Hetauda', 'Itahari',
    'Bharatpur', 'Birgunj', 'Mahendranagar', 'Kalaiya', 'Gorkha', 'Palpa'
  ];

  const nepalZones = [
    'Central', 'Eastern', 'Western', 'Mid-Western', 'Far-Western'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer Information Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Address Validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.zone) newErrors.zone = 'Zone is required';

    // Terms and Conditions
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    console.log('📝 CheckoutForm handleSubmit triggered');
    console.log('📝 Event:', e);
    console.log('📝 onSubmit prop:', onSubmit);
    console.log('📝 Form data:', formData);
    
    e.preventDefault();
    
    console.log('📝 Skipping validation as requested');
    const orderData = {
      ...formData,
      items: cartItems,
      total: getCartTotal(),
      orderDate: new Date().toISOString(),
      orderId: `DOK-${Date.now()}`
    };
    
    console.log('📝 Calling onSubmit with orderData:', orderData);
    onSubmit(orderData);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate customer info
      const customerErrors = {};
      if (!formData.firstName.trim()) customerErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) customerErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) customerErrors.email = 'Email is required';
      if (!formData.phone.trim()) customerErrors.phone = 'Phone number is required';
      
      setErrors(customerErrors);
      if (Object.keys(customerErrors).length === 0) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Validate address
      const addressErrors = {};
      if (!formData.address.trim()) addressErrors.address = 'Address is required';
      if (!formData.city.trim()) addressErrors.city = 'City is required';
      
      setErrors(addressErrors);
      if (Object.keys(addressErrors).length === 0) {
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Customer Info', icon: UserIcon },
    { number: 2, title: 'Delivery Address', icon: MapPinIcon },
    { number: 3, title: 'Review & Confirm', icon: CheckCircleIcon }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Progress Steps */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${currentStep >= step.number 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'border-gray-300 text-gray-400'
                }
              `}>
                {currentStep > step.number ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-red-600' : 'text-gray-500'
                }`}>
                  Step {step.number}
                </p>
                <p className="text-xs text-gray-500">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4 transition-all duration-300
                  ${currentStep > step.number ? 'bg-red-600' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  icon={UserIcon}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  icon={UserIcon}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  icon={EnvelopeIcon}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  icon={PhoneIcon}
                  placeholder="98XXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={nextStep} variant="nepal" size="lg">
                Continue to Delivery Address
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery Address */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Address
              </h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={errors.address}
                  icon={MapPinIcon}
                  placeholder="House no., Street name, Area"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City/Municipality"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    required
                  />
                  
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
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {errors.zone && (
                      <p className="mt-1 text-sm text-red-600">{errors.zone}</p>
                    )}
                  </div>
                  
                  <Input
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <Input
                  label="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  placeholder="Near temple, school, etc."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    value={formData.deliveryNotes}
                    onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any special instructions for delivery"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" size="lg">
                Back to Customer Info
              </Button>
              <Button onClick={nextStep} variant="nepal" size="lg">
                Review Order
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Your Order
              </h3>
              
              {/* Customer Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <p className="text-sm text-gray-600">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
              </div>

              {/* Delivery Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-600">
                  {formData.address}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.city}, {formData.district}, {formData.zone}
                </p>
                {formData.postalCode && (
                  <p className="text-sm text-gray-600">Postal Code: {formData.postalCode}</p>
                )}
                {formData.landmark && (
                  <p className="text-sm text-gray-600">Landmark: {formData.landmark}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                  />
                  <div className="text-sm">
                    <span className="text-gray-700">I agree to the </span>
                    <a href="/terms" className="text-red-600 hover:text-red-700 underline">
                      Terms and Conditions
                    </a>
                    <span className="text-gray-700"> and </span>
                    <a href="/privacy" className="text-red-600 hover:text-red-700 underline">
                      Privacy Policy
                    </a>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Subscribe to our newsletter for updates on new authentic Nepali products
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" size="lg">
                Back to Address
              </Button>
              <Button 
                type="submit" 
                variant="nepal" 
                size="lg"
                loading={isLoading}
                disabled={!formData.agreeToTerms}
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
