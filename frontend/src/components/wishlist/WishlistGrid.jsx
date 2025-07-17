import React, { useState, useContext } from 'react';
import { WishlistContext } from '../../context/WishlistContext';
import WishlistItem from './WishlistItem';
import WishlistHeader from '././WishListHeader';
import EmptyWishlist from '././EmptyWishlist';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';

const WishlistGrid = ({ 
  items = [], 
  loading = false, 
  onItemRemove, 
  onMoveToCart,
  className = '' 
}) => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [gridColumns, setGridColumns] = useState(4);

  const displayItems = items.length > 0 ? items : wishlistItems;

  const filteredItems = displayItems.filter(item => {
    if (filterBy === 'all') return true;
    if (filterBy === 'in-stock') return item.stock > 0;
    if (filterBy === 'out-of-stock') return item.stock === 0;
    if (filterBy === 'on-sale') return item.originalPrice && item.originalPrice > item.price;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt || b.createdAt) - new Date(a.addedAt || a.createdAt);
      case 'oldest':
        return new Date(a.addedAt || a.createdAt) - new Date(b.addedAt || b.createdAt);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from your wishlist?')) {
      clearWishlist();
    }
  };

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" text="Loading your wishlist..." />
      </div>
    );
  }

  if (displayItems.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <WishlistHeader 
        itemCount={displayItems.length}
        filteredCount={sortedItems.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        gridColumns={gridColumns}
        onGridColumnsChange={setGridColumns}
        onClearAll={handleClearAll}
      />

      {/* Items Grid */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No items match your filters
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters to see more products.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSortBy('newest');
              setFilterBy('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={`grid ${gridClasses[gridColumns]} gap-6`}>
          {sortedItems.map((item) => (
            <WishlistItem
              key={item.product?._id || item._id}
              item={item}
              onRemove={onItemRemove}
              onMoveToCart={onMoveToCart}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💝 Your Wishlist Summary
            </h3>
            <p className="text-gray-600">
              {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">
              Rs. {sortedItems.reduce((total, item) => {
                const price = item.product?.salePrice || item.product?.price || item.price || 0;
                return total + price;
              }, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total value</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistGrid;
