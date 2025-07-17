import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, Star, Edit, Trash2, Eye, X, Tag, Calendar, Percent } from 'lucide-react';

import ProductForm from '../../../components/common/ProductForm';
import { sellerAPI, categoryAPI } from '../../../utils/api';
import { toast } from 'react-hot-toast';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountData, setDiscountData] = useState({
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    minQuantity: 1,
    description: ''
  });

  // NEW: Coupon state
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '',
    validFrom: '',
    validUntil: '',
    description: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadCoupons();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCoupons = async () => {
    try {
      const response = await sellerAPI.getSellerCoupons();
      setCoupons(response.coupons || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Failed to load coupons');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category?._id === filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Close all modals
  const closeAllModals = () => {
    setShowForm(false);
    setShowViewModal(false);
    setShowDiscountModal(false);
    setShowCouponModal(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    closeAllModals();
    setEditingProduct(null);
    setShowForm(true);
  };

  // NEW: Coupon handlers
  const handleAddCoupon = () => {
    closeAllModals();
    setCouponData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minimumOrderAmount: '',
      validFrom: '',
      validUntil: '',
      description: ''
    });
    setShowCouponModal(true);
  };

  const handleSaveCoupon = async () => {
    if (!couponData.code || !couponData.discountValue || !couponData.validFrom || !couponData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await sellerAPI.createSellerCoupon(couponData);
      toast.success('Coupon created successfully');
      loadCoupons();
      closeAllModals();
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleEditProduct = (product) => {
    closeAllModals();
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await sellerAPI.deleteSellerProduct(productId);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleViewProduct = (product) => {
    closeAllModals();
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleAddDiscount = (product) => {
    closeAllModals();
    setSelectedProduct(product);
    setShowDiscountModal(true);
    setDiscountData({
      type: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
      minQuantity: 1,
      description: ''
    });
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await sellerAPI.updateSellerProduct(editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await sellerAPI.createSellerProduct(productData);
        toast.success('Product created successfully');
      }
      loadProducts();
      closeAllModals();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleSaveDiscount = () => {
    if (!discountData.value || !discountData.startDate || !discountData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          discount: {
            ...discountData,
            id: Date.now(),
            active: true
          }
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    closeAllModals();
  };

  const handleRemoveDiscount = (productId) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          discount: null
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;

    if (discount.type === 'percentage') {
      return price - (price * (discount.value / 100));
    } else {
      return price - discount.value;
    }
  };

  const isDiscountActive = (discount) => {
    if (!discount) return false;

    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    return now >= startDate && now <= endDate && discount.active;
  };

  // NEW: Coupon Modal Component
  const CouponModal = React.memo(() => {
    const handleInputChange = React.useCallback((field, value) => {
      setCouponData(prev => ({ ...prev, [field]: value }));
    }, []);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeAllModals}></div>
        
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Coupon</h2>
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" 
              onClick={closeAllModals}
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
                <input
                  value={couponData.code}
                  onChange={e => handleInputChange('code', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="SAVE20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Value {couponData.discountType === 'percentage' ? '(%)' : '(Rs)'}
                </label>
                <input
                  type="number"
                  value={couponData.discountValue}
                  onChange={e => handleInputChange('discountValue', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={couponData.discountType}
                  onChange={e => setCouponData({ ...couponData, discountType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (Rs)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Order Amount (Rs)</label>
                <input
                  type="number"
                  value={couponData.minimumOrderAmount}
                  onChange={e => setCouponData({ ...couponData, minimumOrderAmount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={couponData.validFrom}
                  onChange={e => setCouponData({ ...couponData, validFrom: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={couponData.validUntil}
                  onChange={e => setCouponData({ ...couponData, validUntil: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                rows="3"
                value={couponData.description}
                onChange={e => setCouponData({ ...couponData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Special offer for valued customers..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button 
                onClick={closeAllModals} 
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoupon}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  });

  // Product View Modal Component
  const ProductViewModal = () => {
    if (!selectedProduct) return null;

    const hasActiveDiscount = isDiscountActive(selectedProduct.discount);
    const discountedPrice = calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowViewModal(false)}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={() => setShowViewModal(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-gray-500 text-8xl">📦</div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  {hasActiveDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-red-600">
                        Rs{discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        Rs{selectedProduct.price.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                        <Percent size={14} className="mr-1" />
                        {selectedProduct.discount.type === 'percentage'
                          ? `${selectedProduct.discount.value}% OFF`
                          : `Rs${selectedProduct.discount.value} OFF`}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      Rs{selectedProduct.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {selectedProduct.discount && !hasActiveDiscount && (
                  <p className="text-sm text-gray-500">
                    Discount expired or not yet active
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Category:</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
                    {selectedProduct.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProduct.stock > 20 ? 'bg-green-100 text-green-800' :
                      selectedProduct.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {selectedProduct.stock} units
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={18} />
                    <span className="font-medium">{selectedProduct.rating}</span>
                    <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Discount Information */}
              {selectedProduct.discount && (
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Active Discount</h4>
                    <button
                      onClick={() => handleRemoveDiscount(selectedProduct.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{selectedProduct.discount.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Valid: {selectedProduct.discount.startDate} to {selectedProduct.discount.endDate}</p>
                    <p>Min quantity: {selectedProduct.discount.minQuantity}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditProduct(selectedProduct)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Edit size={18} className="inline mr-2" />
                  Edit Product
                </button>
                <button
                  onClick={() => handleAddDiscount(selectedProduct)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Tag size={18} className="inline mr-2" />
                  {selectedProduct.discount ? 'Update Discount' : 'Add Discount'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Discount Modal Component
  const DiscountModal = () => {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowDiscountModal(false)}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedProduct?.discount ? 'Update Discount' : 'Add Discount'}
            </h2>
            <button
              onClick={() => setShowDiscountModal(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Product: {selectedProduct?.name}</h3>
              <p className="text-gray-600">Current Price: Rs{selectedProduct?.price.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type</label>
                <select
                  value={discountData.type}
                  onChange={(e) => setDiscountData({ ...discountData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (Rs)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Value {discountData.type === 'percentage' ? '(%)' : '(Rs)'}
                </label>
                <input
                  type="number"
                  value={discountData.value}
                  onChange={(e) => setDiscountData({ ...discountData, value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={discountData.type === 'percentage' ? '20' : '500'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={discountData.startDate}
                  onChange={(e) => setDiscountData({ ...discountData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={discountData.endDate}
                  onChange={(e) => setDiscountData({ ...discountData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Quantity</label>
              <input
                type="number"
                value={discountData.minQuantity}
                onChange={(e) => setDiscountData({ ...discountData, minQuantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="1"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={discountData.description}
                onChange={(e) => setDiscountData({ ...discountData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Limited time offer for loyal customers..."
              />
            </div>

            {/* Preview */}
            {discountData.value && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Discount Preview</h4>
                <div className="text-sm text-green-700">
                  <p>Original Price: Rs{selectedProduct?.price.toLocaleString()}</p>
                  <p>Discounted Price: Rs{calculateDiscountedPrice(selectedProduct?.price, discountData).toLocaleString()}</p>
                  <p>You Save: Rs{(selectedProduct?.price - calculateDiscountedPrice(selectedProduct?.price, discountData)).toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDiscount}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Save Discount
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          
          {/* Updated button section with both buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Plus size={20} />
              <span className="font-medium">Add New Product</span>
            </button>
            
            <button
              onClick={handleAddCoupon}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Tag size={20} />
              <span className="font-medium">Add Coupon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasActiveDiscount = isDiscountActive(product.discount);
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

              return (
                <div key={product._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 group relative">
                  {hasActiveDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      {product.discount.type === 'percentage'
                        ? `${product.discount.value}% OFF`
                        : `Rs${product.discount.value} OFF`}
                    </div>
                  )}

                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-gray-500 text-6xl">📦</div>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="mb-2">
                    {hasActiveDiscount ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-red-600">
                          Rs{discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          Rs{product.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-gray-900">
                        Rs{product.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      product.stock > 20 ? 'bg-green-200 text-green-800' :
                        product.stock > 5 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                      }`}>
                      {product.stock} in stock
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-sm text-gray-600">{product.rating || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 flex items-center justify-center space-x-1 text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      <span className="text-sm">View</span>
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center space-x-1 text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center space-x-1 text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const hasActiveDiscount = isDiscountActive(product.discount);
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

              return (
                <div key={product._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-gray-500 text-2xl">📦</div>
                    )}
                    {hasActiveDiscount && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm capitalize">{product.category?.name || product.category}</p>
                  </div>

                  <div className="text-right">
                    {hasActiveDiscount ? (
                      <div>
                        <p className="font-bold text-red-600">Rs{discountedPrice.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 line-through">Rs{product.price.toLocaleString()}</p>
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900">Rs{product.price.toLocaleString()}</p>
                    )}
                    <p className="text-sm text-gray-600">{product.stock} in stock</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={closeAllModals}
        />
      )}

      {/* Product View Modal */}
      {showViewModal && <ProductViewModal />}

      {/* Discount Modal */}
      {showDiscountModal && <DiscountModal />}

      {/* NEW: Coupon Modal */}
      {showCouponModal && <CouponModal />}
    </div>
  );
};

export default Products;
