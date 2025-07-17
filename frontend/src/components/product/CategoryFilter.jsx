import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';

const CategoryFilter = ({ 
  onFilterChange, 
  initialFilters = {}, 
  className = '',
  isCollapsed = false 
}) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 50000],
    rating: '',
    availability: '',
    sortBy: 'relevance',
    ...initialFilters
  });
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const [priceInput, setPriceInput] = useState({
    min: filters.priceRange[0],
    max: filters.priceRange[1]
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'musical-instruments', label: 'Musical Instruments' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'tools-crafts', label: 'Tools & Crafts' },
    { value: 'clothing', label: 'Clothing' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Sort by Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const priceRanges = [
    { label: 'Under Rs. 1,000', min: 0, max: 1000 },
    { label: 'Rs. 1,000 - Rs. 5,000', min: 1000, max: 5000 },
    { label: 'Rs. 5,000 - Rs. 15,000', min: 5000, max: 15000 },
    { label: 'Rs. 15,000 - Rs. 30,000', min: 15000, max: 30000 },
    { label: 'Above Rs. 30,000', min: 30000, max: 100000 }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4', label: '4★ and above' },
    { value: '3', label: '3★ and above' },
    { value: '2', label: '2★ and above' },
    { value: '1', label: '1★ and above' }
  ];

  const availabilityOptions = [
    { value: '', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [range.min, range.max]
    }));
    setPriceInput({ min: range.min, max: range.max });
  };

  const handleCustomPriceChange = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: [priceInput.min, priceInput.max]
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: [0, 50000],
      rating: '',
      availability: '',
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    setPriceInput({ min: 0, max: 50000 });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000) count++;
    if (filters.rating) count++;
    if (filters.availability) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronDownIcon className={`h-5 w-5 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Dropdown
              options={sortOptions}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              variant="nepal"
              size="sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Dropdown
              options={categories}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              variant="nepal"
              size="sm"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              {/* Quick Price Ranges */}
              <div className="grid grid-cols-1 gap-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => handlePriceRangeChange(range)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

           
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Rating
            </label>
            <Dropdown
              options={ratingOptions}
              value={filters.rating}
              onChange={(value) => handleFilterChange('rating', value)}
              variant="nepal"
              size="sm"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <Dropdown
              options={availabilityOptions}
              value={filters.availability}
              onChange={(value) => handleFilterChange('availability', value)}
              variant="nepal"
              size="sm"
            />
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="primary" className="flex items-center space-x-1">
                    <span>{categories.find(c => c.value === filters.category)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000) && (
                  <Badge variant="primary" className="flex items-center space-x-1">
                    <span>Rs. {filters.priceRange[0].toLocaleString()} - Rs. {filters.priceRange[1].toLocaleString()}</span>
                    <button
                      onClick={() => handleFilterChange('priceRange', [0, 50000])}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.rating && (
                  <Badge variant="primary" className="flex items-center space-x-1">
                    <span>{filters.rating}★ & above</span>
                    <button
                      onClick={() => handleFilterChange('rating', '')}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.availability && (
                  <Badge variant="primary" className="flex items-center space-x-1">
                    <span>{availabilityOptions.find(a => a.value === filters.availability)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('availability', '')}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge> 
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
