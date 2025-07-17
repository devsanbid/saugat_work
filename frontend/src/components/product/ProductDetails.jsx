import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ShareIcon, 
  TruckIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/CartContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProductImages from './ProductImages';

const ProductDetails = ({ product, isQuickView = false, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      variant: selectedVariant
    });
    if (isQuickView && onClose) {
      onClose();
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="lg:sticky lg:top-4">
        <ProductImages 
          images={product.images} 
          productName={product.name}
        />
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        {!isQuickView && (
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/products/${product.category}`} className="hover:text-red-600 capitalize">
              {product.category?.replace('-', ' ')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>
        )}

        {/* Product Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-600">{product.shortDescription}</p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          <Badge variant="cultural" size="sm">
            {product.category?.replace('-', ' ')}
          </Badge>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercentage > 0 && (
              <Badge variant="danger" size="md">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Inclusive of all taxes. Free delivery in Kathmandu Valley.
          </p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center space-x-4">
          {product.stock > 0 ? (
            <Badge variant="success" size="md">
              ✓ In Stock ({product.stock} available)
            </Badge>
          ) : (
            <Badge variant="danger" size="md">
              Out of Stock
            </Badge>
          )}
          {product.isAuthentic && (
            <Badge variant="nepal" size="md">
              🇳🇵 Authentic Nepali Product
            </Badge>
          )}
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Options:</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                    selectedVariant === variant
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  {variant.name}
                  {variant.price && (
                    <span className="ml-2 text-sm">
                      +{formatPrice(variant.price)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Quantity:</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="w-16 text-center text-lg font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant="nepal"
              size="lg"
              className="flex-1"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleWishlistToggle}
              variant="outline"
              size="lg"
              className="px-4"
            >
              {isWishlisted ? (
                <HeartIconSolid className="h-5 w-5 text-red-600" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-4"
            >
              <ShareIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Features */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Free delivery in Kathmandu Valley</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">100% Authentic Nepali Product</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-600">💰</span>
            <span className="text-sm text-gray-700">Cash on Delivery Available</span>
          </div>
        </div>

        {/* Product Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Description:</h3>
          <div className="text-gray-700 space-y-2">
            <p>{product.description}</p>
            {product.features && (
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Cultural Information */}
        {product.culturalInfo && (
          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🇳🇵 Cultural Heritage
            </h3>
            <p className="text-gray-700 text-sm">
              {product.culturalInfo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
