import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CartItem = ({ item, compact = false, showActions = true }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { updateQuantity, removeFromCart, addToWishlist } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      handleRemove();
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    // Add a small delay for smooth animation
    setTimeout(() => {
      removeFromCart(item.id);
    }, 300);
  };

  const handleMoveToWishlist = () => {
    addToWishlist(item);
    removeFromCart(item.id);
  };

  const itemTotal = item.price * item.quantity;
  const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300
      ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className={`flex ${compact ? 'space-x-3' : 'space-x-4'}`}>
        {/* Product Image */}
        <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} flex-shrink-0`}>
          <Link to={`/product/${item.id}`}>
            <div className="w-full h-full rounded-md overflow-hidden border border-gray-200">
              {!imageError ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
                  <span className="text-2xl opacity-50">{item.emoji || '🎨'}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link
                to={`/product/${item.id}`}
                className="block hover:text-red-600 transition-colors"
              >
                <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
                  {item.name}
                </h3>
              </Link>
              
              {/* Category and Authenticity */}
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="cultural" size="sm">
                  {item.category?.replace('-', ' ')}
                </Badge>
                {item.isAuthentic && (
                  <Badge variant="nepal" size="sm">
                    <span className="mr-1">🇳🇵</span>
                    Authentic
                  </Badge>
                )}
              </div>

              {/* Variant Information */}
              {item.variant && (
                <p className="text-sm text-gray-500 mt-1">
                  Variant: {item.variant.name}
                </p>
              )}

              {/* Stock Status */}
              {item.stock < 5 && item.stock > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Only {item.stock} left in stock
                </p>
              )}
            </div>

            {/* Remove Button */}
            {showActions && (
              <button
                onClick={handleRemove}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors ml-2"
                aria-label="Remove from cart"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-red-600 ${compact ? 'text-sm' : 'text-base'}`}>
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && (
                <span className={`text-gray-500 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            {showActions && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                  disabled={item.quantity >= item.stock}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Item Total and Savings */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">{formatPrice(itemTotal)}</span>
            </div>
            {savings > 0 && (
              <div className="text-sm text-green-600">
                You save: {formatPrice(savings)}
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && !compact && (
            <div className="flex items-center space-x-4 mt-3">
              <button
                onClick={handleMoveToWishlist}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center space-x-1"
              >
                <HeartIcon className="h-4 w-4" />
                <span>Move to Wishlist</span>
              </button>
              <Link
                to={`/product/${item.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
