import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ProductCard = ({ product, onQuickView, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if user is not authenticated
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-red-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50">
              <span className="text-6xl opacity-50">{product.emoji || '🎨'}</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isNew && (
              <Badge variant="success" size="sm">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="default" size="sm">Out of Stock</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
              aria-label="Add to wishlist"
            >
              {isWishlisted ? (
                <HeartIconSolid className="h-5 w-5 text-red-600" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-600" />
              )}
            </button>
            
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
              aria-label="Quick view"
            >
              <EyeIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
            </button>
          </div>

          {/* Add to Cart Button - Appears on Hover */}
          <div className={`absolute bottom-3 left-3 right-3 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant="nepal"
              size="sm"
              fullWidth
              className="shadow-lg"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="cultural" size="sm">
              {product.category?.replace('-', ' ')}
            </Badge>
            {product.rating && (
              <div className="flex items-center text-sm text-yellow-600">
                <span className="mr-1">⭐</span>
                <span>{product.rating}</span>
                <span className="text-gray-500 ml-1">({product.reviewCount || 0})</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.freeDelivery && (
              <Badge variant="success" size="sm">Free Delivery</Badge>
            )}
          </div>

          {/* Cultural Authenticity Badge */}
          {product.isAuthentic && (
            <div className="mt-3 flex items-center justify-center">
              <Badge variant="nepal" size="sm" className="bg-gradient-to-r from-red-100 to-blue-100">
                <span className="mr-1">🇳🇵</span>
                Authentic Nepali Product
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
