import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import SearchBar from '../common/SearchBar';
import ErrorIllustration from './ErrorIllustration';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const popularCategories = [
    { name: 'Musical Instruments', path: '/products/musical-instruments', icon: '🎵' },
    { name: 'Handicrafts', path: '/products/handicrafts', icon: '🎨' },
    { name: 'Grocery', path: '/products/grocery', icon: '🥘' },
    { name: 'Tools & Crafts', path: '/products/tools-crafts', icon: '🔧' },
    { name: 'Clothing', path: '/products/clothing', icon: '👘' }
  ];

  const featuredProducts = [
    { name: 'Traditional Sarangi', price: 'Rs. 15,000', image: '🎻' },
    { name: 'Handwoven Doko', price: 'Rs. 2,500', image: '🧺' },
    { name: 'Khukuri Knife', price: 'Rs. 8,000', image: '🗡️' },
    { name: 'Dhaka Topi', price: 'Rs. 1,200', image: '🧢' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Traditional Nepal Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Cpath d='M40 0c22.091 0 40 17.909 40 40s-17.909 40-40 40S0 62.091 0 40 17.909 0 40 0z' fill='%23dc2626' fill-opacity='0.05'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Illustration */}
          <div className="mb-8">
            <ErrorIllustration type="404" size="lg" />
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              दुः खी छु! यो पृष्ठ भेटिएन। (Sorry! This page was not found.)
            </p>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              The page you're looking for might have been moved, deleted, or doesn't exist. 
              Let's help you find what you're looking for from our authentic Nepali products.
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Search for Products
              </h3>
              <SearchBar />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="nepal"
              size="lg"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Go to Homepage</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Popular Categories */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Explore Our Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="group p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-red-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Featured Products
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-gray-200 hover:border-red-300 transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{product.image}</div>
                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-red-600 font-semibold">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you believe this is an error or need assistance, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                View FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center text-gray-500">
            <p className="text-sm">
              📞 +977-1-4567890 | 📧 hello@doko.com.np | 📍 Thamel, Kathmandu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
