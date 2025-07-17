import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  ShareIcon,
  TrashIcon,
  ArrowLeftIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { WishlistContext } from '../.././context/WishlistContext';
import { CartContext } from '../.././context/CartContext';
import { AuthContext } from '../.././context/AuthContext';
import WishlistGrid from '../../components/wishlist/WishlistGrid';
import WishlistHeader from '../../components/wishlist/WishListHeader';
import EmptyWishlist from '../../components/wishlist/EmptyWishlist';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { wishlistItems, clearWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [user, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      const stock = item.product?.stock || item.stock || 0;
      if (stock > 0) {
        const productData = item.product || item;
        addToCart(productData);
      }
    });
    
    const availableItems = wishlistItems.filter(item => (item.product?.stock || item.stock || 0) > 0);
    if (availableItems.length > 0) {
      alert(`${availableItems.length} items added to cart!`);
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(itemId => {
      removeFromWishlist(itemId);
    });
    setSelectedItems(new Set());
    setBulkActionMode(false);
  };

  const handleBulkAddToCart = () => {
    const selectedWishlistItems = wishlistItems.filter(item => {
      const itemId = item.product?._id || item._id;
      const stock = item.product?.stock || item.stock || 0;
      return selectedItems.has(itemId) && stock > 0;
    });
    
    selectedWishlistItems.forEach(item => {
      const productData = item.product || item;
      addToCart(productData);
    });
    
    if (selectedWishlistItems.length > 0) {
      alert(`${selectedWishlistItems.length} items added to cart!`);
    }
    
    setSelectedItems(new Set());
    setBulkActionMode(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Doko Wishlist',
          text: `Check out my wishlist of ${wishlistItems.length} authentic Nepali products!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
    setIsShareModalOpen(false);
  };

  const totalValue = wishlistItems.reduce((total, item) => {
    const price = item.product?.salePrice || item.product?.price || item.price || 0;
    return total + price;
  }, 0);
  const inStockItems = wishlistItems.filter(item => (item.product?.stock || item.stock || 0) > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your wishlist..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkActionMode(!bulkActionMode)}
                className="flex items-center space-x-2"
              >
                <FunnelIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {bulkActionMode ? 'Cancel' : 'Select Items'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkActionMode && wishlistItems.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.size} items selected
                </span>
                <button
                  onClick={() => {
                    if (selectedItems.size === wishlistItems.length) {
                      setSelectedItems(new Set());
                    } else {
                      setSelectedItems(new Set(wishlistItems.map(item => item.product?._id || item._id)));
                    }
                  }}
                  className="text-sm text-blue-700 hover:text-blue-900"
                >
                  {selectedItems.size === wishlistItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkAddToCart}
                  disabled={selectedItems.size === 0}
                  className="flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedItems.size === 0}
                  className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <EmptyWishlist showSuggestions={true} />
        ) : (
          <div className="space-y-8">
            {/* Wishlist Summary */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-red-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Saved Favorites
                  </h2>
                  <p className="text-gray-700">
                    मनपर्ने सामानहरू - {wishlistItems.length} authentic Nepali products worth {formatPrice(totalValue)}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="nepal"
                    onClick={handleMoveAllToCart}
                    disabled={inStockItems.length === 0}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add All to Cart ({inStockItems.length})</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsClearModalOpen(true)}
                    className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Clear Wishlist</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Wishlist Header with Controls */}
            <WishlistHeader 
              itemCount={wishlistItems.length}
              filteredCount={wishlistItems.length}
              onClearAll={() => setIsClearModalOpen(true)}
              onShare={handleShare}
            />

            {/* Wishlist Grid */}
            <WishlistGrid 
              items={wishlistItems}
              loading={false}
              onItemRemove={(itemId) => {
                removeFromWishlist(itemId);
                setSelectedItems(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(itemId);
                  return newSet;
                });
              }}
              onMoveToCart={(item) => {
                addToCart(item);
              }}
              bulkActionMode={bulkActionMode}
              selectedItems={selectedItems}
              onItemSelect={(itemId) => {
                setSelectedItems(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(itemId)) {
                    newSet.delete(itemId);
                  } else {
                    newSet.add(itemId);
                  }
                  return newSet;
                });
              }}
            />
          </div>
        )}
      </div>

      {/* Cultural Message */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🇳🇵 Treasures Worth Saving
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Each item in your wishlist represents the skilled craftsmanship of Nepali artisans. 
              These authentic products carry the heritage and stories of our rich culture.
            </p>
          </div>
        </div>
      </div>

      {/* Clear Wishlist Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Wishlist"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Are you sure you want to clear your wishlist?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. All {wishlistItems.length} items will be removed from your wishlist.
          </p>
          
          <div className="flex space-x-3 justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setIsClearModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearWishlist();
                setIsClearModalOpen(false);
                setSelectedItems(new Set());
                setBulkActionMode(false);
              }}
              className="flex-1"
            >
              Clear Wishlist
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Your Wishlist"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Share Your Favorites
            </h3>
            <p className="text-gray-600">
              Let others discover these amazing authentic Nepali products!
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => copyToClipboard(window.location.href)}
              className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🔗</span>
              <span>Copy Wishlist Link</span>
            </button>
            
            <button
              onClick={() => copyToClipboard(`Check out my wishlist of ${wishlistItems.length} authentic Nepali products at Doko! ${window.location.href}`)}
              className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">📱</span>
              <span>Copy Message</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WishlistPage;
