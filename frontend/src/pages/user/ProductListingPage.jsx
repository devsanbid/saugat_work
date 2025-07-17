import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ProductGrid from '../../components/product/ProductGrid';
import CategoryFilter from '../../components/product/CategoryFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Dropdown from '../../components/ui/Dropdown';
import { productAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const ProductListingPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [gridColumns, setGridColumns] = useState(4);
  
  const [filters, setFilters] = useState({
    category: category || '',
    priceRange: [0, 50000],
    rating: '',
    availability: '',
    sortBy: 'relevance',
    search: ''
  });

  // Category information
  const categoryInfo = {
    'musical-instruments': {
      name: 'Musical Instruments',
      nepaliName: 'संगीत वाद्ययन्त्र',
      description: 'Authentic traditional Nepali musical instruments crafted by skilled artisans',
      icon: '🎵',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50'
    },
    'handicrafts': {
      name: 'Handicrafts',
      nepaliName: 'हस्तकला',
      description: 'Beautiful handmade crafts representing Nepal\'s artistic heritage',
      icon: '🎨',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50'
    },
    'grocery': {
      name: 'Nepali Grocery',
      nepaliName: 'नेपाली किराना',
      description: 'Traditional Nepali food items and organic produce',
      icon: '🥘',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50'
    },
    'tools-crafts': {
      name: 'Tools & Crafts',
      nepaliName: 'औजार र शिल्प',
      description: 'Traditional tools and utility items for daily use',
      icon: '🔧',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    'clothing': {
      name: 'Traditional Clothing',
      nepaliName: 'परम्परागत पोशाक',
      description: 'Authentic Nepali traditional clothing and accessories',
      icon: '👘',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  };

  const currentCategory = categoryInfo[category] || {
    name: 'All Products',
    nepaliName: 'सबै उत्पादनहरू',
    description: 'Browse all authentic Nepali products',
    icon: '🛍️',
    color: 'from-red-500 to-blue-500',
    bgColor: 'bg-gradient-to-r from-red-50 to-blue-50'
  };

  // API state management
  const [error, setError] = useState(null);

  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';
    
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      category: category || ''
    }));
  }, [category, location.search]);

  // Load products from backend API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters for API call
        const queryParams = {
          page: currentPage,
          limit: 12
        };
        
        // Add filters to query params
        if (filters.category) {
          queryParams.category = filters.category;
        }
        
        if (filters.search) {
          queryParams.search = filters.search;
        }
        
        if (filters.priceRange[0] > 0) {
          queryParams.minPrice = filters.priceRange[0];
        }
        
        if (filters.priceRange[1] < 50000) {
          queryParams.maxPrice = filters.priceRange[1];
        }
        
        if (filters.rating) {
          queryParams.rating = filters.rating;
        }
        
        if (filters.availability === 'in-stock') {
          queryParams.availability = 'in-stock';
        }
        
        // Map sortBy to backend format
        switch (filters.sortBy) {
          case 'price-low':
            queryParams.sortBy = 'price';
            queryParams.sortOrder = 'asc';
            break;
          case 'price-high':
            queryParams.sortBy = 'price';
            queryParams.sortOrder = 'desc';
            break;
          case 'rating':
            queryParams.sortBy = 'rating';
            queryParams.sortOrder = 'desc';
            break;
          case 'newest':
            queryParams.sortBy = 'newest';
            break;
          case 'popular':
            queryParams.sortBy = 'popular';
            break;
          default:
            queryParams.sortBy = 'createdAt';
            queryParams.sortOrder = 'desc';
        }
        
        // Call the API
        const response = await productAPI.getProducts(queryParams);
        
        if (response.success) {
          // For pagination, append new products or replace based on page
          if (currentPage === 1) {
            setProducts(response.products);
          } else {
            setProducts(prev => [...prev, ...response.products]);
          }
          
          setTotalProducts(response.total);
          setHasMore(response.currentPage < response.totalPages);
        } else {
          throw new Error(response.message || 'Failed to fetch products');
        }
        
      } catch (error) {
        console.error('Error loading products:', error);
        setError(error.message);
        toast.error('Failed to load products. Please try again.');
        
        // Set empty state on error
        setProducts([]);
        setTotalProducts(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' }
    ];
    
    if (category) {
      breadcrumbs.push({ name: currentCategory.name, path: `/products/${category}` });
    }
    
    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <Link
                  to={crumb.path}
                  className={`${
                    index === getBreadcrumbs().length - 1
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-600 hover:text-red-600'
                  } transition-colors`}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* Category Header */}
      <section className={`${currentCategory.bgColor} py-12`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentCategory.name}
            </h1>
            <p className="text-xl text-gray-600 mb-2">{currentCategory.nepaliName}</p>
            <p className="text-gray-700 max-w-2xl mx-auto">{currentCategory.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CategoryFilter
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setIsMobileFiltersOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
                <Badge variant="primary" size="sm">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${totalProducts} Products Found`}
                </h2>
                {filters.search && (
                  <p className="text-gray-600">Results for "{filters.search}"</p>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ListBulletIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {viewMode === 'grid' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Columns:</span>
                    <select
                      value={gridColumns}
                      onChange={(e) => setGridColumns(parseInt(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading products
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              columns={gridColumns}
              showQuickView={true}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <CategoryFilter
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                isCollapsed={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cultural Info Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Authentic {currentCategory.name}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Each product in our {currentCategory.name.toLowerCase()} collection represents centuries of 
              Nepali craftsmanship and cultural heritage. Made by skilled artisans using traditional 
              techniques passed down through generations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListingPage;
