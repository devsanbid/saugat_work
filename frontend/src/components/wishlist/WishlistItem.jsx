import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TrashIcon, 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const WishlistItem = ({ item, onRemove, onMoveToCart, compact = false }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { removeFromWishlist } = useContext(WishlistContext);
  
  // Handle nested product structure from backend
  const product = item.product || item;
  const itemId = product._id || item._id;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromWishlist(itemId);
      if (onRemove) onRemove(itemId);
    }, 300);
  };

  const handleAddToCart = () => {
    addToCart(product);
    if (onMoveToCart) onMoveToCart(product);
  };

  const currentPrice = product.salePrice || product.price || 0;
  const originalPrice = product.originalPrice || product.price;
  const discountPercentage = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 group
      ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100 hover:shadow-xl hover:border-red-300 hover:-translate-y-1'}
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-md mb-3">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
              <span className="text-6xl opacity-50">{product.emoji || '🎨'}</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <Badge variant="success" size="sm">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="default" size="sm">Out of Stock</Badge>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleRemove}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-red-500 hover:text-red-700"
              aria-label="Remove from wishlist"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Quick View Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/product/${item._id}`}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-blue-500 hover:text-blue-700"
              aria-label="Quick view"
            >
              <EyeIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category and Rating */}
          <div className="flex items-center justify-between">
            <Badge variant="cultural" size="sm">
              {item.category?.replace('-', ' ')}
            </Badge>
            {item.rating && (
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{item.rating}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/product/${itemId}`}>
            <h3 className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Authenticity Badge */}
          {item.isAuthentic && (
            <Badge variant="nepal" size="sm" className="w-full justify-center">
              <span className="mr-1">🇳🇵</span>
              Authentic Nepali Product
            </Badge>
          )}

          {/* Stock Status */}
          {product.stock === 0 ? (
            <p className="text-sm text-red-600 font-medium">Out of Stock</p>
          ) : product.stock < 5 ? (
            <p className="text-sm text-orange-600">Only {product.stock} left in stock</p>
          ) : (
            <p className="text-sm text-green-600">✓ In Stock</p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant="nepal"
              size="sm"
              className="flex-1"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              onClick={handleRemove}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <HeartIconSolid className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
