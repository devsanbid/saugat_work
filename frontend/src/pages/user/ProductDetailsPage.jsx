import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShareIcon, 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { CartContext } from '../.././context/CartContext';
import { WishlistContext } from '../.././context/WishlistContext';
import { AuthContext } from '../.././context/AuthContext';
import ProductImages from '../../components/product/ProductImages';
import ProductReviews from '../../components/product/ProductReviews';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { productAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product details
        const productResponse = await productAPI.getProductById(id);
        
        if (productResponse.success) {
          console.log('Product data received:', productResponse.product);
          console.log('Product images:', productResponse.product.images);
          setProduct(productResponse.product);
          
          // Fetch related products
          try {
            const relatedResponse = await productAPI.getProducts({
              category: productResponse.product.category,
              limit: 4
            });
            
            if (relatedResponse.success) {
              // Filter out current product from related products
              const filtered = relatedResponse.products.filter(
                p => p._id !== productResponse.product._id
              );
              setRelatedProducts(filtered.slice(0, 4));
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            // Don't show error for related products, just set empty array
            setRelatedProducts([]);
          }
        } else {
          setError(productResponse.message || 'Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again.');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      quantity,
      variant: selectedVariant,
      addedAt: new Date().toISOString()
    };
    
    addToCart(cartItem);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    
    if (!product) return;
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return Math.max(1, Math.min(product?.stock || 1, newQuantity));
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
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
    alert('Copied to clipboard!');
  };

  const getBreadcrumbs = () => {
    if (!product) return [];
    
    return [
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
      { name: product.subcategory || 'Products', path: `/products/${product.category}` },
      { name: product.name, path: `/product/${product._id}` }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 opacity-50">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Error Loading Product' : 'Product Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The product you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button variant="nepal" onClick={() => navigate('/categories')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Badge variant="cultural" size="sm">
                {product.category?.replace('-', ' ')}
              </Badge>
              {product.isAuthentic && (
                <Badge variant="nepal" size="sm">
                  <span className="mr-1">🇳🇵</span>
                  Authentic
                </Badge>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="lg:sticky lg:top-8">
            <ProductImages 
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{product.nepaliName}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="danger" size="md">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Inclusive of all taxes. {product.freeDelivery && 'Free delivery in Kathmandu Valley.'}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <Badge variant="success" size="md" className="flex items-center space-x-1 w-fit">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>In Stock ({product.stock} available)</span>
                </Badge>
              ) : (
                <Badge variant="danger" size="md">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Choose Variant:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedVariant?.id === variant.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="variant"
                          value={variant.id}
                          checked={selectedVariant?.id === variant.id}
                          onChange={() => variant.inStock && setSelectedVariant(variant)}
                          disabled={!variant.inStock}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="font-medium">{variant.name}</span>
                        {!variant.inStock && (
                          <Badge variant="danger" size="sm">Out of Stock</Badge>
                        )}
                      </div>
                      {variant.price !== 0 && (
                        <span className="text-sm font-medium">
                          {variant.price > 0 ? '+' : ''}{formatPrice(variant.price)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center text-xl font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  variant="nepal"
                  size="lg"
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className={`px-6 ${isInWishlist(product._id) ? 'text-red-600 border-red-600' : ''}`}
                >
                  {isInWishlist(product._id) ? (
                    <HeartIconSolid className="h-5 w-5 text-red-600" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <ShareIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">
                  {product.freeDelivery ? 'Free delivery' : 'Delivery available'} in {product.deliveryInfo?.deliveryTime || '2-3 days'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">100% Authentic Nepali Product</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-600">💰</span>
                <span className="text-sm text-gray-700">Cash on Delivery Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600">🔄</span>
                <span className="text-sm text-gray-700">{product.deliveryInfo?.returnPolicy || '7 days'} Return Policy</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm" className="flex items-center space-x-1">
                    <TagIcon className="h-3 w-3" />
                    <span>{tag}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews', 'artisan'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'artisan' ? 'Artisan Info' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.longDescription}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                    <>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews
                productId={product._id}
                reviews={product.reviews}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            )}

            {activeTab === 'artisan' && (
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet the Artisan</h3>
                {product.artisanInfo ? (
                  <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {product.artisanInfo.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.artisanInfo.name || 'Unknown Artisan'}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          📍 {product.artisanInfo.location || 'Nepal'} | 🎯 {product.artisanInfo.specialty || 'Traditional Craft'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Experience: {product.artisanInfo.experience || 'Not specified'}
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {product.artisanInfo.bio || 'No bio available for this artisan.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No artisan information available for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cultural Heritage Section */}
        {product.culturalInfo && (
          <div className="mt-16 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🇳🇵 Cultural Heritage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.culturalInfo}
              </p>
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                product={relatedProduct}
                onQuickView={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Product"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]?.url} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => copyToClipboard(window.location.href)}
              className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🔗</span>
              <span>Copy Link</span>
            </button>
            
            <button
              onClick={() => copyToClipboard(`Check out this amazing ${product.name} from Doko! ${window.location.href}`)}
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

export default ProductDetailsPage;
