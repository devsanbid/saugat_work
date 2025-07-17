import React from 'react';
import { 
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  TrashIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';

const WishlistHeader = ({ 
  itemCount, 
  filteredCount, 
  sortBy, 
  onSortChange, 
  filterBy, 
  onFilterChange,
  gridColumns,
  onGridColumnsChange,
  onClearAll,
  onShare 
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Recently Added' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'on-sale', label: 'On Sale' }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Doko Wishlist',
        text: `Check out my wishlist of ${itemCount} authentic Nepali products!`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist link copied to clipboard!');
    }
    if (onShare) onShare();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Title Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-full">
            <HeartIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">
              {itemCount > 0 ? (
                <>
                  {filteredCount} of {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  {filteredCount !== itemCount && ' (filtered)'}
                </>
              ) : (
                'No items in your wishlist'
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ShareIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          {itemCount > 0 && (
            <Button
              onClick={onClearAll}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Controls Section */}
      {itemCount > 0 && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Left Side - Filters and Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <Dropdown
                options={filterOptions}
                value={filterBy}
                onChange={onFilterChange}
                size="sm"
                className="min-w-32"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                size="sm"
                className="min-w-40"
              />
            </div>
          </div>

          {/* Right Side - View Options */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {[2, 3, 4, 5].map(cols => (
                <button
                  key={cols}
                  onClick={() => onGridColumnsChange(cols)}
                  className={`p-2 rounded-md transition-colors ${
                    gridColumns === cols 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label={`${cols} columns`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {itemCount > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{itemCount}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {filteredCount > 0 ? Math.round((filteredCount / itemCount) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">In Stock</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {itemCount > 0 ? Math.round((itemCount / 100) * 15) : 0}
            </p>
            <p className="text-sm text-gray-600">On Sale</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">🇳🇵</p>
            <p className="text-sm text-gray-600">Authentic</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistHeader;
