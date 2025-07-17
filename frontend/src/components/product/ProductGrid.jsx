import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../ui/Modal';
import ProductDetails from './ProductDetails';
import Button from '../ui/Button';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  onLoadMore,
  hasMore = false,
  columns = 4,
  showQuickView = true,
  className = ''
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  const handleQuickView = (product) => {
    if (showQuickView) {
      setSelectedProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" text="Loading authentic Nepali products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏔️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6 opacity-50">🧺</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any products matching your criteria. 
          Try adjusting your filters or search terms.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="nepal" onClick={() => window.location.href = '/categories'}>
            Browse Categories
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Product Grid */}
      <div className={`grid ${gridColumns[columns]} gap-6 mb-8`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
      </div>

      {/* Loading More */}
      {loading && products.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="Loading more products..." />
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center py-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="min-w-48"
          >
            Load More Products
          </Button>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && (
        <Modal
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
          title="Quick View"
          size="3xl"
        >
          {selectedProduct && (
            <ProductDetails 
              product={selectedProduct} 
              isQuickView={true}
              onClose={closeQuickView}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default ProductGrid;
