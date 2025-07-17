import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  HeartIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  const productCategories = [
    { name: 'Musical Instruments', path: '/products/musical-instruments' },
    { name: 'Handicrafts', path: '/products/handicrafts' },
    { name: 'Grocery', path: '/products/grocery' },
    { name: 'Tools & Crafts', path: '/products/tools-crafts' },
    { name: 'Clothing', path: '/products/clothing' }
  ];

  const customerService = [
    { name: 'My Account', path: '/profile' },
    { name: 'Order History', path: '/orders' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Return Policy', path: '/return-policy' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Refund Policy', path: '/refund' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-10"
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="h-5 w-5" />
      </button>

      {/* Traditional Nepal pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-2 rounded-full">
                <span className="text-white font-bold text-xl">🧺</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                  Doko
                </h2>
                <p className="text-sm text-gray-300">Authentic Nepal</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the authentic essence of Nepal through our carefully curated collection of traditional products. 
              From handcrafted musical instruments to cultural clothing, we bring Nepal's rich heritage to your doorstep.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPinIcon className="h-4 w-4 text-red-400" />
                <span>Thamel, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <PhoneIcon className="h-4 w-4 text-red-400" />
                <span>+977-1-4567890</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <EnvelopeIcon className="h-4 w-4 text-red-400" />
                <span>hello@doko.com.np</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-4 mt-6 text-white">Categories</h3>
            <ul className="space-y-2">
              {productCategories.slice(0, 3).map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm block py-1"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm block py-1"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">
                Subscribe to get updates on new products and special offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-red-500 text-white text-sm"
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-r-lg transition-all duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-md font-medium mb-3 text-white">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} Doko. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <span>Made with</span>
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span>in Nepal</span>
                <span className="text-lg">🇳🇵</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Payment Options:</span>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>💳 Cash on Delivery</span>
                <span>•</span>
                <span>🏪 Store Pickup</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Secure & Trusted</span>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">🔒</span>
                <span className="text-gray-400 text-sm">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
