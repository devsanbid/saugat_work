import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, getCartTotal, getCartCount } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const itemCount = getCartCount();
  const subtotal = getCartTotal();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-blue-50">
          <div className="flex items-center space-x-2">
            <ShoppingBagIcon className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            {itemCount > 0 && (
              <Badge variant="primary" size="sm">
                {itemCount}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {itemCount === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-4 opacity-30">🧺</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover authentic Nepali products and add them to your cart.
                </p>
                <Button
                  variant="nepal"
                  onClick={() => {
                    onClose();
                    window.location.href = '/categories';
                  }}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    compact={true}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {itemCount > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Free Shipping Indicator */}
              {subtotal >= 2000 ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <span className="text-sm">🎉</span>
                    <span className="text-sm font-medium">
                      You qualified for free delivery!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-yellow-700">
                      <span className="text-sm">🚚</span>
                      <span className="text-sm">
                        Add {formatPrice(2000 - subtotal)} more for free delivery!
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link to="/cart" onClick={onClose}>
                  <Button variant="outline" size="lg" fullWidth>
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout" onClick={onClose}>
                  <Button variant="nepal" size="lg" fullWidth>
                    Checkout
                  </Button>
                </Link>
              </div>

              {/* Quick Links */}
              <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-gray-200">
                <Link
                  to="/categories"
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Wishlist
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
