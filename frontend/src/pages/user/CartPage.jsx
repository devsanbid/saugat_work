import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  ArrowLeftIcon,
  TrashIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  TagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart, loading } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isClearing, setIsClearing] = useState(false);

  const cartItemCount = getCartCount();
  const cartTotal = getCartTotal();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/user/checkout' } });
      return;
    }
    navigate('/user/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your cart..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <ShoppingCartIcon className="h-8 w-8 text-red-600" />
                  <span>Shopping Cart</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  {cartItemCount === 0 ? 'Your cart is empty' : `${cartItemCount} item${cartItemCount > 1 ? 's' : ''} in your cart`}
                </p>
              </div>
            </div>
            {cartItemCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearing}
                className="flex items-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4" />
                <span>{isClearing ? 'Clearing...' : 'Clear Cart'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItemCount === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-30">🧺</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover authentic Nepali products and add them to your cart to get started.
            </p>
            <div className="space-y-4">
              <Button
                variant="nepal"
                size="lg"
                onClick={() => navigate('/categories')}
                className="px-8"
              >
                Start Shopping
              </Button>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <Link to="/categories" className="hover:text-red-600 transition-colors">
                  Browse Categories
                </Link>
                <Link to="/user/wishlist" className="hover:text-red-600 transition-colors flex items-center space-x-1">
                  <HeartIcon className="h-4 w-4" />
                  <span>View Wishlist</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Info Banner */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      {cartTotal >= 2000 ? (
                        '🎉 Congratulations! You qualify for FREE delivery'
                      ) : (
                        `Add ${formatPrice(2000 - cartTotal)} more for FREE delivery`
                      )}
                    </p>
                    <p className="text-sm text-green-600">
                      Free delivery available in Kathmandu Valley
                    </p>
                  </div>
                </div>
                {cartTotal < 2000 && (
                  <div className="mt-3">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((cartTotal / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Items in your cart ({cartItemCount})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="p-6">
                      <CartItem
                        item={item}
                        showActions={true}
                        compact={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Trust Badges */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Why shop with us?</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">100% secure transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Fast Delivery</p>
                      <p className="text-sm text-gray-600">3-5 days delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TagIcon className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Best Prices</p>
                      <p className="text-sm text-gray-600">Authentic products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary showCheckoutButton={true} />

                {/* Help Section */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Need Help?</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact our customer support for any assistance.
                      </p>
                      <Link
                        to="/contact"
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors mt-2 inline-block"
                      >
                        Contact Support →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
