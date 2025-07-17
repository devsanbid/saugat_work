import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const EmptyWishlist = ({ showSuggestions = true }) => {
  const featuredCategories = [
    {
      name: 'Musical Instruments',
      path: '/products/musical-instruments',
      icon: '🎵',
      description: 'Traditional Nepali instruments'
    },
    {
      name: 'Handicrafts',
      path: '/products/handicrafts',
      icon: '🎨',
      description: 'Authentic handmade crafts'
    },
    {
      name: 'Clothing',
      path: '/products/clothing',
      icon: '👘',
      description: 'Traditional Nepali attire'
    },
    {
      name: 'Tools & Crafts',
      path: '/products/tools-crafts',
      icon: '🔧',
      description: 'Traditional tools and crafts'
    }
  ];

  const popularProducts = [
    { name: 'Traditional Sarangi', price: 'Rs. 15,000', emoji: '🎻' },
    { name: 'Handwoven Doko', price: 'Rs. 2,500', emoji: '🧺' },
    { name: 'Khukuri Knife', price: 'Rs. 8,000', emoji: '🗡️' },
    { name: 'Dhaka Topi', price: 'Rs. 1,200', emoji: '🧢' }
  ];

  return (
    <div className="min-h-96 flex items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Main Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl mb-4 opacity-30 animate-pulse">❤️</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl transform rotate-12 animate-bounce">🧺</div>
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          तपाईंको मनपर्ने सामानहरू यहाँ राख्नुहोस्! 
          <br />
          Save your favorite authentic Nepali products here for later.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/categories">
            <Button variant="nepal" size="lg" className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5" />
              <span>Explore Categories</span>
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="flex items-center space-x-2">
              <HeartIcon className="h-5 w-5" />
              <span>Browse Popular Items</span>
            </Button>
          </Link>
        </div>

        {/* How to Use Wishlist */}
        <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 mb-8 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 How to Use Your Wishlist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👀</span>
              <span className="text-gray-700">Browse and find products you love</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">❤️</span>
              <span className="text-gray-700">Click the heart icon to save items</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛒</span>
              <span className="text-gray-700">Add to cart when you're ready</span>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        {showSuggestions && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              🎯 Popular Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="group p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Products */}
        {showSuggestions && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              🌟 Popular Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularProducts.map((product, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{product.emoji}</div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {product.name}
                    </h4>
                    <p className="text-red-600 font-semibold text-sm">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Quote */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            "मन परेको कुरा सम्झनु पर्छ" - What the heart likes should be remembered
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Traditional Nepali wisdom about keeping track of what you love
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyWishlist;
