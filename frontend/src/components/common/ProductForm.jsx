import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus, Minus, Image, Trash2 } from 'lucide-react';
import { categoryAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';

const ProductForm = ({ onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    stock: product?.stock || '',
    category: product?.category?._id || product?.category || '',
    subcategory: product?.subcategory || '',
    sku: product?.sku || '',
    tags: product?.tags?.join(', ') || '',
    district: product?.district || '',
    artisan: product?.artisan || '',
    isNewProduct: product?.isNewProduct || false,
    isAuthentic: product?.isAuthentic || false,
    isFeatured: product?.isFeatured || false,
    seoTitle: product?.seoTitle || '',
    seoDescription: product?.seoDescription || '',
    seoKeywords: product?.seoKeywords?.join(', ') || ''
  });

  const [categories, setCategories] = useState([
    { _id: 'electronics', name: 'Electronics' },
    { _id: 'clothing', name: 'Clothing & Fashion' },
    { _id: 'home-garden', name: 'Home & Garden' },
    { _id: 'sports', name: 'Sports & Outdoors' },
    { _id: 'books', name: 'Books & Media' },
    { _id: 'toys', name: 'Toys & Games' },
    { _id: 'health-beauty', name: 'Health & Beauty' },
    { _id: 'automotive', name: 'Automotive' },
    { _id: 'jewelry', name: 'Jewelry & Accessories' },
    { _id: 'food-beverages', name: 'Food & Beverages' },
    { _id: 'handicrafts', name: 'Handicrafts & Art' },
    { _id: 'musical-instruments', name: 'Musical Instruments' }
  ]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState(product?.images?.map((img, index) => ({
    id: index,
    url: img,
    isExisting: true
  })) || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      if (response.categories && response.categories.length > 0) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if at least one image is selected
      if (selectedImages.length === 0) {
        alert('Please select at least one product image');
        setLoading(false);
        return;
      }
      
      const allImages = [...selectedImages.filter(img => img.isExisting).map(img => img.url)];
      
      // Handle new image uploads
      const newImages = selectedImages.filter(img => !img.isExisting);
      if (newImages.length > 0) {
        // For now, we'll use placeholder URLs. In a real app, you'd upload to a service like Cloudinary
        allImages.push(...newImages.map(img => img.url));
      }
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword) : [],
        image: allImages[0], // Primary image (required by backend)
        images: allImages // All images array
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result,
          name: file.name,
          isExisting: false
        };
        setSelectedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Describe your product..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (Rs)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Optional - for showing discounts"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Product SKU"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., T-Shirts, Smartphones"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Kathmandu, Pokhara"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Artisan Name</label>
                <input
                  type="text"
                  value={formData.artisan}
                  onChange={(e) => setFormData(prev => ({ ...prev, artisan: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Name of the artisan or creator"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., handmade, traditional, organic"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNewProduct"
                    checked={formData.isNewProduct}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNewProduct: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isNewProduct" className="text-sm font-semibold text-gray-700">New Product</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAuthentic"
                    checked={formData.isAuthentic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAuthentic: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isAuthentic" className="text-sm font-semibold text-gray-700">Authentic</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700">Featured</label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
            
            {/* Image Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-300 hover:border-red-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Upload className="text-gray-400" size={48} />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  {isDragging ? 'Drop images here' : 'Drag and drop images here'}
                </p>
                <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Choose Files
                </button>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Images ({selectedImages.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEO Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Information (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
