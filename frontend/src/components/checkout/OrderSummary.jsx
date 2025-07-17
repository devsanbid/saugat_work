import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import Badge from '../ui/Badge';

const OrderSummary = ({ compact = false }) => {
  const { cartItems, getCartTotal, getCartCount } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const subtotal = getCartTotal();
  const itemCount = getCartCount();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  const savings = cartItems.reduce((total, item) => {
    return total + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          <Badge variant="primary" size="sm">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center hidden">
                  <span className="text-lg opacity-50">{item.emoji || '🎨'}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="cultural" size="sm">
                    {item.category?.replace('-', ' ')}
                  </Badge>
                  {item.isAuthentic && (
                    <Badge variant="nepal" size="sm">
                      🇳🇵
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Calculations */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>

          {/* Savings */}
          {savings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">You Save:</span>
              <span className="font-medium text-green-600">-{formatPrice(savings)}</span>
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium text-gray-900">
              {tax === 0 ? 'Included' : formatPrice(tax)}
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="text-red-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-600">🚚</span>
            <span>
              {shipping === 0 ? 'Free delivery' : `Delivery: ${formatPrice(shipping)}`}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-blue-600">🛡️</span>
            <span>100% Authentic Products</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-600">💰</span>
            <span>Cash on Delivery</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-yellow-600">⭐</span>
            <span>30-day Return Policy</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {shipping > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center space-x-2 text-sm text-yellow-800 mb-2">
              <span>📦</span>
              <span>Add {formatPrice(2000 - subtotal)} more for free delivery!</span>
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
    </div>
  );
};

export default OrderSummary;
