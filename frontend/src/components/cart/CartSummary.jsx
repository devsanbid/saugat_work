import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, ShieldCheckIcon, TagIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { CartContext } from '../../context/CartContext';
import { cartAPI } from '../../utils/api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CartSummary = ({ showCheckoutButton = true, compact = false }) => {
  const { cartItems, getCartTotal, getCartCount, applyCoupon, appliedCoupon, removeCoupon } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const subtotal = getCartTotal();
  const itemCount = getCartCount();
  const shipping = subtotal >= 2000 ? 0 : 150; // Free shipping above Rs. 2000
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.discountType === 'percentage' ? 
      (subtotal * appliedCoupon.discountValue) / 100 : 
      appliedCoupon.discountValue) : 0;
  const total = subtotal + shipping - couponDiscount;

  const savings = cartItems.reduce((total, item) => {
    return total + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0);
  }, 0);

  const handleCouponApply = async (couponCode) => {
    try {
      const response = await cartAPI.applyCoupon({ 
        couponCode, 
        cartItems: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      });
      if (response.success) {
        applyCoupon({
          code: couponCode,
          discountValue: response.cart.appliedCoupon.discountValue,
          discountType: response.cart.appliedCoupon.discountType,
          description: response.cart.appliedCoupon.description
        });
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid coupon code');
    }
  };

  const handleCouponRemove = async () => {
    try {
      await cartAPI.removeCoupon();
      removeCoupon();
      toast.success('Coupon removed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove coupon');
    }
  };

  if (itemCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-6xl mb-4 opacity-50">🧺</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some authentic Nepali products to get started!</p>
        <Link to="/categories">
          <Button variant="nepal" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h3>
      </div>

      {/* Summary Details */}
      <div className="p-4 space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">Coupon Discount:</span>
                <Badge variant="success" size="sm">{appliedCoupon.code}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-green-600">-{formatPrice(couponDiscount)}</span>
                <button
                  onClick={handleCouponRemove}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>You Save:</span>
              <span className="font-medium">{formatPrice(savings)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-red-600">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Coupon Section */}
        {!compact && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TagIcon className="h-4 w-4" />
              <span>Have a coupon code?</span>
            </div>
            <CouponInput onApply={handleCouponApply} />
          </div>
        )}

        {/* Delivery Information */}
        <div className="bg-gray-50 rounded-md p-3 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <TruckIcon className="h-4 w-4 text-green-600" />
            <span>
              {shipping === 0 ? 'Free delivery' : `Delivery: ${formatPrice(shipping)}`}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
            <span>100% Authentic Products</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="text-green-600">💰</span>
            <span>Cash on Delivery Available</span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="bg-yellow-50 rounded-md p-3">
            <div className="flex items-center space-x-2 text-sm text-yellow-800 mb-2">
              <InformationCircleIcon className="h-4 w-4" />
              <span>Add {formatPrice(2000 - subtotal)} more for free delivery!</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <div className="space-y-3">
            <Link to="/user/checkout">
              <Button variant="nepal" size="lg" fullWidth>
                Proceed to Checkout
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="md" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Coupon Input Component
const CouponInput = ({ onApply }) => {
  const [couponCode, setCouponCode] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);

  const handleApply = () => {
    if (couponCode.trim()) {
      setIsApplying(true);
      onApply(couponCode.trim().toUpperCase());
      setTimeout(() => {
        setIsApplying(false);
        setCouponCode('');
      }, 1000);
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
      />
      <Button
        onClick={handleApply}
        disabled={!couponCode.trim() || isApplying}
        loading={isApplying}
        variant="outline"
        size="sm"
      >
        Apply
      </Button>
    </div>
  );
};

export default CartSummary;
