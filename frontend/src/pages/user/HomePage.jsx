import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

import Hero2 from "../../../src/assets/hero2.png"
import Music_banner from "../../../src/assets/banner_music.jpg"
import Handcrafts_banner from "../../../src/assets/handcrafts_banner.jpg"
import Musical_instru from "../../../src/assets/category_music.jpg"
import clothing from "../../../src/assets/dress_category.jpg"
import tools from "../../../src/assets/tools_category.jpg"
import grocery from "../../../src/assets/grocery_category.jpg"
import handicrafts from "../../../src/assets/handicraft_landscape.jpg"

import khukuri from "../../../src/assets/khukuri.jpg"
import DhakaTopi from "../../../src/assets/DhakaTopi.jpg"
import Dokoimg from "../../../src/assets/Doko_001.jpg"
import sarangiimg from "../../../src/assets/sarangii.jpeg"

import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import ProductCard from '../../components/product/ProductCard';

import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const slideInterval = useRef(null);

  // Hero Banner Data
  const heroSlides = [
    {
      id: 1,
      title: "Discover Authentic Nepal",
      subtitle: "स्वागतम्! Welcome to Doko",
      description: "Explore the rich cultural heritage of Nepal through our carefully curated collection of authentic handmade products, traditional instruments, and cultural treasures.",
      image: Hero2,
      cta: "Shop Now",
      ctaLink: "/categories",
      overlay: "bg-gradient-to-r from-red-900/80 to-blue-900/60"
    },
    {
      id: 2,
      title: "Traditional Musical Instruments",
      subtitle: "संगीतको स्वर - Sounds of Nepal",
      description: "From the melodious Sarangi to the rhythmic Madal, discover authentic Nepali musical instruments crafted by skilled artisans.",
      image: Music_banner,
      cta: "Explore Music",
      ctaLink: "/products/musical-instruments",
      overlay: "bg-gradient-to-r from-purple-900/80 to-pink-900/60"
    },
    {
      id: 3,
      title: "Handcrafted with Love",
      subtitle: "हस्तकलाको कलाकृति - Master Craftsmanship",
      description: "Each piece tells a story of skilled artisans who have preserved traditional techniques for generations.",
      image: Handcrafts_banner,
      cta: "View Handicrafts",
      ctaLink: "/products/handicrafts",
      overlay: "bg-gradient-to-r from-green-900/80 to-teal-900/60"
    }
  ];

  // Categories Data
  const categories = [
    {
      id: 'musical-instruments',
      name: 'Musical Instruments',
      description: 'Traditional Nepali instruments',
      image: Musical_instru,
      productCount: 45,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts',
      description: 'Authentic handmade crafts',
      image: handicrafts,
      productCount: 78,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'clothing',
      name: 'Traditional Clothing',
      description: 'Cultural attire & accessories',
      image: clothing,
      productCount: 56,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'tools-crafts',
      name: 'Tools & Crafts',
      description: 'Traditional tools & utility items',
      image: tools,
      productCount: 34,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'grocery',
      name: 'Nepali Grocery',
      description: 'Traditional food items',
      image: grocery,
      productCount: 89,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  // Mock Featured Products
  const mockFeaturedProducts = [
    {
      id: 1,
      name: 'Handcrafted Sarangi',
      price: 15000,
      originalPrice: 18000,
      image: sarangiimg,
      rating: 4.8,
      reviewCount: 24,
      category: 'musical-instruments',
      isNew: true,
      isAuthentic: true,
      stock: 5
    },
    {
      id: 2,
      name: 'Traditional Doko Basket',
      price: 2500,
      image: Dokoimg,
      rating: 4.9,
      reviewCount: 31,
      category: 'tools-crafts',
      isAuthentic: true,
      stock: 12
    },
    {
      id: 3,
      name: 'Handwoven Dhaka Topi',
      price: 1200,
      originalPrice: 1500,
      image: DhakaTopi,
      rating: 4.7,
      reviewCount: 18,
      category: 'clothing',
      isAuthentic: true,
      stock: 8
    },
    {
      id: 4,
      name: 'Authentic Khukuri',
      price: 8000,
      image: khukuri,
      rating: 5.0,
      reviewCount: 42,
      category: 'tools-crafts',
      isAuthentic: true,
      stock: 3
    }
  ];

  // Mock Testimonials
  const mockTestimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Kathmandu, Nepal',
      rating: 5,
      comment: 'Amazing quality! The sarangi I bought sounds beautiful and the craftsmanship is exceptional.',
      avatar: '/api/placeholder/60/60',
      product: 'Handcrafted Sarangi'
    },
    {
      id: 2,
      name: 'Rajesh Thapa',
      location: 'Pokhara, Nepal',
      rating: 5,
      comment: 'Doko has the best collection of authentic Nepali products. Fast delivery and excellent service!',
      avatar: '/api/placeholder/60/60',
      product: 'Traditional Doko Basket'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'I love the authentic Nepali products. The quality is outstanding and shipping was surprisingly fast!',
      avatar: '/api/placeholder/60/60',
      product: 'Thanka Painting'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isAutoPlaying, heroSlides.length]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setFeaturedProducts(mockFeaturedProducts);
        setTestimonials(mockTestimonials);
        setLoading(false);
      }, 1500);
    };

    loadData();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleWishlist = (productId) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading authentic Nepali products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-blue-900/30 flex items-center justify-center hidden">
                <span className="text-9xl opacity-20">🏔️</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="transform transition-all duration-1000 translate-y-0">
                <h1
                  className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
                  style={{
                    color: '#ffffff',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.7)'
                  }}
                >
                  {heroSlides[currentSlide].title}
                </h1>
                <p
                  className="text-xl md:text-2xl mb-4 font-medium"
                  style={{
                    color: '#fde047',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.7)'
                  }}
                >
                  {heroSlides[currentSlide].subtitle}
                </p>
                <p
                  className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                  style={{
                    color: '#ffffff',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.7)'
                  }}
                >
                  {heroSlides[currentSlide].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={heroSlides[currentSlide].ctaLink}>
                    <Button
                      variant="nepal"
                      size="xl"
                      className="transform hover:scale-105 transition-transform shadow-2xl"
                    >
                      {heroSlides[currentSlide].cta}
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery across Nepal for orders above Rs. 5,000</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-gray-600">All products are certified authentic Nepali items</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <HeartIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Made with Love</h3>
              <p className="text-gray-600">Handcrafted by skilled Nepali artisans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - FIXED */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover authentic Nepali products across various categories, each telling a unique story of our rich cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/${category.id}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white"
              >
                {/* Image container with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback for broken images */}
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center hidden">
                    <span className="text-6xl opacity-50">{category.icon}</span>
                  </div>
                  {/* Hover overlay - now properly positioned */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                </div>

                {/* Content section */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 group-hover:text-white/90 transition-colors duration-300">
                    {category.description}
                  </p>
                  <Badge
                    variant="success"
                    className="group-hover:bg-white/20 group-hover:text-white transition-colors duration-300"
                  >
                    {category.productCount} Products
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked authentic Nepali products that showcase the finest craftsmanship and cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard
                  product={product}
                  onQuickView={() => { }}
                  className="h-full"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="nepal" size="lg" className="transform hover:scale-105 transition-transform">
                View All Products
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Preserving Nepal's Cultural Heritage
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              नेपालको सांस्कृतिक सम्पदा संरक्षण गर्दै - Every purchase supports local artisans and helps preserve traditional craftsmanship that has been passed down through generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-lg">Skilled Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-lg">Authentic Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-lg">Districts Covered</div>
              </div>
            </div>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Learn Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from customers who have experienced the authentic quality of our Nepali products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold hidden">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">"{testimonial.comment}"</p>
                <p className="text-sm text-gray-500">Purchased: {testimonial.product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Doko
            </h2>
            <p className="text-xl mb-8">
              Get notified about new authentic products, special offers, and cultural stories from Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
