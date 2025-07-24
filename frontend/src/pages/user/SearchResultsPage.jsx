import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ProductGrid from '../../components/product/ProductGrid';
import CategoryFilter from '../../components/product/CategoryFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { productAPI } from '../../utils/api';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [gridColumns, setGridColumns] = useState(4);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 50000],
    rating: '',
    availability: '',
    sortBy: 'relevance'
  });



  // Popular search suggestions
  const popularSearches = [
    'Sarangi', 'Khukuri', 'Dhaka Topi', 'Thanka', 'Gundruk',
    'Honey', 'Madal', 'Doko', 'Daura Suruwal', 'Singing Bowl'
  ];

  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    setLoading(true);
    setIsSearching(true);
    
    try {
      const searchParams = {
        q: query,
        page: currentPage,
        limit: 20,
        ...filters
      };
      
      const response = await productAPI.searchProducts(searchParams);
      
      if (response.success) {
        setSearchResults(response.data.products);
        setTotalResults(response.data.total);
        setHasMore(response.data.hasMore);
        
        // Generate search suggestions
        generateSearchSuggestions(query);
      } else {
        toast.error('Failed to search products');
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };



  const generateSearchSuggestions = (query) => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }
    
    const suggestions = popularSearches.filter(item =>
      item.toLowerCase().includes(query.toLowerCase()) && 
      item.toLowerCase() !== query.toLowerCase()
    );
    
    setSearchSuggestions(suggestions.slice(0, 5));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Re-search with new filters
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleNewSearch = (query) => {
    const newUrl = `/search?q=${encodeURIComponent(query)}`;
    navigate(newUrl);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setTotalResults(0);
    setSearchSuggestions([]);
    navigate('/search');
  };

  const handleSuggestionClick = (suggestion) => {
    handleNewSearch(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleNewSearch}
                placeholder="Search for authentic Nepali products..."
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsMobileFiltersOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <Badge variant="primary" size="sm">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Info and Suggestions */}
      <div className="container mx-auto px-4 py-6">
        {/* Search Query Info */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${totalResults} products found`}
                </p>
              </div>
              
              {searchQuery && (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear Search</span>
                </Button>
              )}
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State - No Search Query */}
        {!searchQuery && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6 opacity-30">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Search Doko
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                खोज्नुहोस् - Find authentic Nepali products
              </p>
              
              {/* Popular Searches */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleNewSearch(search)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Musical Instruments', icon: '🎵', path: '/products/musical-instruments' },
                  { name: 'Handicrafts', icon: '🎨', path: '/products/handicrafts' },
                  { name: 'Clothing', icon: '👘', path: '/products/clothing' },
                  { name: 'Tools & Crafts', icon: '🔧', path: '/products/tools-crafts' },
                  { name: 'Grocery', icon: '🥘', path: '/products/grocery' },
                  { name: 'All Categories', icon: '📂', path: '/categories' }
                ].map((category, index) => (
                  <Link
                    key={index}
                    to={category.path}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <CategoryFilter
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {loading || isSearching ? (
                <div className="flex justify-center items-center py-16">
                  <LoadingSpinner size="lg" text="Searching products..." />
                </div>
              ) : totalResults === 0 ? (
                // No Results
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">😔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found for "{searchQuery}"
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try different keywords or browse our categories
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="nepal"
                        onClick={() => handleNewSearch('')}
                      >
                        Clear Search
                      </Button>
                      <Link to="/categories">
                        <Button variant="outline">
                          Browse Categories
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Search Tips */}
                    <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto mt-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Search Tips:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Try using different keywords</li>
                        <li>• Check spelling and try again</li>
                        <li>• Use broader search terms</li>
                        <li>• Browse by category instead</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {totalResults} Products Found
                      </h2>
                      <p className="text-gray-600">
                        Showing results for "{searchQuery}"
                      </p>
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
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <ProductGrid
                    products={searchResults}
                    loading={false}
                    columns={gridColumns}
                    showQuickView={true}
                  />
                </>
              )}
            </div>
          </div>
        )}
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

      {/* Cultural Search Tips */}
      {searchQuery && totalResults > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🇳🇵 Discover Authentic Nepal
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Each search result represents authentic Nepali craftsmanship. These products are made by skilled 
                artisans using traditional techniques that have been preserved for generations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
