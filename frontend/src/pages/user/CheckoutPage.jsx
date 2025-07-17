import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { CartContext } from '../.././context/CartContext';
import { AuthContext } from '../.././context/AuthContext';
import { cartAPI, orderAPI } from '../../utils/api';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import DeliveryInfo from '../../components/checkout/DeliveryInfo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Redirect if cart is empty
  useEffect(() => {
    if (getCartCount() === 0) {
      navigate('/cart');
      return;
    }
  }, [getCartCount, navigate]);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
  }, [user, navigate]);

  // Calculate estimated delivery
  useEffect(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleOrderSubmit = async (formData) => {
    console.log('🚀 handleOrderSubmit called with formData:', formData);
    console.log('📦 Current cart items:', cartItems);
    console.log('👤 Current user:', user);
    console.log('💳 Payment method:', paymentMethod);
    
    setIsProcessing(true);
    
    try {
      console.log('🔄 Starting cart sync...');
      await syncCartWithBackend();
      console.log('✅ Cart sync completed');

      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode || '',
          country: 'Nepal'
        },
        paymentMethod: paymentMethod === 'cod' ? 'cash_on_delivery' : paymentMethod,
        notes: formData.deliveryNotes || ''
      };
      
      console.log('📋 Order data prepared:', orderData);

      console.log('🌐 Sending order to API...');
      const result = await orderAPI.createOrder(orderData);
      console.log('✅ Order API response:', result);

      toast.success(`Order ${result.order.orderNumber} placed successfully! 🎉`);

      console.log('🧹 Clearing cart...');
      clearCart();
      
      console.log('🔄 Navigating to confirmation...');
      navigate('/order-confirmation', {
        state: {
          orderNumber: result.order.orderNumber,
          totalAmount: result.order.totalAmount,
          estimatedDelivery: new Date(result.order.estimatedDelivery).toLocaleDateString(),
          orderId: result.order._id
        }
      });
      
    } catch (error) {
      console.error('❌ Order submission error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast.error(error.message || 'There was an error processing your order. Please try again.');
    } finally {
      console.log('🏁 Setting isProcessing to false');
      setIsProcessing(false);
    }
  };

  const syncCartWithBackend = async () => {
    console.log('🔄 syncCartWithBackend started');
    console.log('📦 Cart items to sync:', cartItems);
    
    try {
      console.log('🧹 Attempting to clear backend cart...');
      try {
        await cartAPI.clearCart();
        console.log('✅ Backend cart cleared successfully');
      } catch (clearError) {
        console.log('⚠️ Clear cart error:', clearError.message);
        if (!clearError.message.includes('Cart not found')) {
          console.error('❌ Unexpected clear cart error:', clearError);
          throw clearError;
        }
        console.log('ℹ️ Cart not found - will create new one');
      }
      
      console.log('➕ Adding items to backend cart...');
      for (const item of cartItems) {
        console.log('➕ Adding item:', { productId: item.id, quantity: item.quantity });
        await cartAPI.addToCart({
          productId: item.id,
          quantity: item.quantity
        });
        console.log('✅ Item added successfully');
      }
      console.log('✅ All items synced to backend');
    } catch (error) {
      console.error('❌ Cart sync error:', error);
      console.error('❌ Cart sync error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw new Error('Failed to sync cart. Please try again.');
    }
  };

  const totalItems = getCartCount();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Redirecting..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/cart')}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Cart</span>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600">
                  Complete your order of {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="success" className="flex items-center space-x-1">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Secure Checkout</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-green-600 rounded max-w-24"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <span className="text-sm font-medium text-red-600">Checkout</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded max-w-24"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">3</span>
              </div>
              <span className="text-sm text-gray-600">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm 
              onSubmit={handleOrderSubmit}
              isLoading={isProcessing}
            />
          </div>

          {/* Order Summary & Delivery Info */}
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary />
            <DeliveryInfo 
              deliveryAddress={orderData?.deliveryAddress}
              estimatedDelivery={estimatedDelivery}
            />
          </div>
        </div>
      </div>

      {/* Security & Trust Section */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              🔒 Secure & Trusted Checkout
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Payment
                </h4>
                <p className="text-gray-600">
                  Your payment information is encrypted and secure with SSL protection.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <TruckIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Fast Delivery
                </h4>
                <p className="text-gray-600">
                  Free delivery in Kathmandu Valley within 3-5 days for orders above Rs. 2,000.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <span className="text-2xl">🇳🇵</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Authentic Products
                </h4>
                <p className="text-gray-600">
                  All products are 100% authentic and sourced directly from Nepali artisans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-gray-900">
            Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="text-xl font-bold text-red-600">
            {formatPrice(total)}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <TruckIcon className="h-4 w-4" />
          <span>
            {shipping === 0 ? 'Free delivery' : `+ ${formatPrice(shipping)} delivery`}
          </span>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-white py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              💳 Payment Methods
            </h4>
            <div className="flex justify-center items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <span className="text-sm">Cash on Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏪</span>
                <span className="text-sm">Store Pickup</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm">Secure & Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <LoadingSpinner size="lg" text="Processing your order..." />
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">Please don't close this page</p>
              <p className="text-sm text-gray-500">
                We're creating your order and preparing it for delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
