import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ProductContext = createContext();

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_FEATURED_PRODUCTS':
      return { ...state, featuredProducts: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'SET_CURRENT_PRODUCT':
      return { ...state, currentProduct: action.payload };
    
    case 'SET_RELATED_PRODUCTS':
      return { ...state, relatedProducts: action.payload };
    
    case 'SET_PRODUCT_REVIEWS':
      return { ...state, productReviews: action.payload };
    
    case 'ADD_REVIEW':
      return { 
        ...state, 
        productReviews: [...state.productReviews, action.payload] 
      };
    
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, stock: action.payload.stock }
            : product
        )
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

const initialState = {
  products: [],
  categories: [],
  featuredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  productReviews: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'relevance',
  filters: {
    category: '',
    priceRange: [0, 50000],
    rating: '',
    availability: '',
    isAuthentic: false,
    district: '',
    artisan: ''
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Mock categories data
  const mockCategories = [
    {
      id: 'musical-instruments',
      name: 'Musical Instruments',
      nepaliName: 'संगीत वाद्ययन्त्र',
      description: 'Traditional Nepali musical instruments',
      icon: '🎵',
      image: '/api/placeholder/300/200',
      productCount: 45,
      subcategories: ['Sarangi', 'Bansuri', 'Tabla', 'Madal', 'Damphu']
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts',
      nepaliName: 'हस्तकला',
      description: 'Beautiful handmade crafts',
      icon: '🎨',
      image: '/api/placeholder/300/200',
      productCount: 78,
      subcategories: ['Thanka Paintings', 'Wood Carvings', 'Pottery', 'Singing Bowls']
    },
    {
      id: 'clothing',
      name: 'Traditional Clothing',
      nepaliName: 'परम्परागत पोशाक',
      description: 'Authentic Nepali traditional clothing',
      icon: '👘',
      image: '/api/placeholder/300/200',
      productCount: 56,
      subcategories: ['Daura Suruwal', 'Gunyu Cholo', 'Dhaka Topi', 'Sari']
    },
    {
      id: 'tools-crafts',
      name: 'Tools & Crafts',
      nepaliName: 'औजार र शिल्प',
      description: 'Traditional tools and utility items',
      icon: '🔧',
      image: '/api/placeholder/300/200',
      productCount: 34,
      subcategories: ['Khukuri', 'Doko Baskets', 'Farming Tools', 'Kitchen Utensils']
    },
    {
      id: 'grocery',
      name: 'Nepali Grocery',
      nepaliName: 'नेपाली किराना',
      description: 'Traditional Nepali food items',
      icon: '🥘',
      image: '/api/placeholder/300/200',
      productCount: 89,
      subcategories: ['Gundruk', 'Sukuti', 'Honey', 'Nepali Tea']
    }
  ];

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Handcrafted Sarangi',
      price: 15000,
      originalPrice: 18000,
      image: '/api/placeholder/300/300',
      images: [
        '/api/placeholder/300/300',
        '/api/placeholder/300/300',
        '/api/placeholder/300/300'
      ],
      rating: 4.8,
      reviewCount: 24,
      category: 'musical-instruments',
      subcategory: 'String Instruments',
      description: 'Traditional Nepali string instrument handcrafted by skilled artisans',
      isNew: true,
      isAuthentic: true,
      isFeatured: true,
      stock: 5,
      sku: 'SAR-001',
      artisan: 'Ram Bahadur Tamang',
      district: 'Kathmandu',
      tags: ['traditional', 'handmade', 'music', 'nepal'],
      specifications: {
        material: 'Seasoned wood',
        dimensions: '24" x 8" x 4"',
        weight: '1.2 kg',
        origin: 'Kathmandu Valley'
      }
    },
    {
      id: 2,
      name: 'Traditional Doko Basket',
      price: 2500,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      rating: 4.9,
      reviewCount: 31,
      category: 'tools-crafts',
      subcategory: 'Baskets',
      description: 'Handwoven bamboo basket perfect for carrying goods',
      isAuthentic: true,
      isFeatured: false,
      stock: 12,
      sku: 'DOK-002',
      artisan: 'Sita Gurung',
      district: 'Chitwan',
      tags: ['bamboo', 'handwoven', 'utility', 'traditional']
    },
    {
      id: 3,
      name: 'Dhaka Topi Cap',
      price: 1200,
      originalPrice: 1500,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      rating: 4.7,
      reviewCount: 18,
      category: 'clothing',
      subcategory: 'Headwear',
      description: 'Traditional Nepali cap with authentic Dhaka fabric',
      isAuthentic: true,
      isFeatured: true,
      stock: 8,
      sku: 'DT-003',
      artisan: 'Krishna Shrestha',
      district: 'Bhaktapur',
      tags: ['dhaka', 'traditional', 'cap', 'nepal']
    },
    {
      id: 4,
      name: 'Authentic Khukuri',
      price: 8000,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      rating: 5.0,
      reviewCount: 42,
      category: 'tools-crafts',
      subcategory: 'Knives',
      description: 'Authentic Nepali curved knife with traditional design',
      isAuthentic: true,
      isFeatured: true,
      stock: 3,
      sku: 'KHU-004',
      artisan: 'Dhan Bahadur Kami',
      district: 'Dharan',
      tags: ['khukuri', 'traditional', 'knife', 'authentic']
    },
    {
      id: 5,
      name: 'Thanka Painting',
      price: 12000,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      rating: 4.9,
      reviewCount: 15,
      category: 'handicrafts',
      subcategory: 'Paintings',
      description: 'Traditional Buddhist Thanka painting',
      isAuthentic: true,
      isFeatured: false,
      stock: 7,
      sku: 'TH-005',
      artisan: 'Tenzin Norbu',
      district: 'Kathmandu',
      tags: ['thanka', 'buddhist', 'painting', 'art']
    },
    {
      id: 6,
      name: 'Organic Nepali Honey',
      price: 800,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      rating: 4.6,
      reviewCount: 28,
      category: 'grocery',
      subcategory: 'Honey',
      description: 'Pure mountain honey from Nepali hills',
      isAuthentic: true,
      isFeatured: false,
      stock: 15,
      sku: 'HON-006',
      artisan: 'Prakash Rai',
      district: 'Ilam',
      tags: ['honey', 'organic', 'mountain', 'pure']
    }
  ];

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadProducts();
    loadFeaturedProducts();
  }, []);

  const loadCategories = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Simulate API call
      setTimeout(() => {
        dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 500);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load categories' });
    }
  };

  const loadProducts = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Simulate API call
      setTimeout(() => {
        let filteredProducts = [...mockProducts];
        
        // Apply filters
        if (filters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        if (filters.searchQuery) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }
        if (filters.priceRange) {
          filteredProducts = filteredProducts.filter(p => 
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
          );
        }
        if (filters.rating) {
          filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(filters.rating));
        }
        if (filters.availability === 'in-stock') {
          filteredProducts = filteredProducts.filter(p => p.stock > 0);
        }
        if (filters.isAuthentic) {
          filteredProducts = filteredProducts.filter(p => p.isAuthentic);
        }
        
        dispatch({ type: 'SET_PRODUCTS', payload: filteredProducts });
      }, 800);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const featured = mockProducts.filter(p => p.isFeatured);
      dispatch({ type: 'SET_FEATURED_PRODUCTS', payload: featured });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load featured products' });
    }
  };

  const getProductById = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const product = mockProducts.find(p => p.id === parseInt(id));
      
      if (product) {
        dispatch({ type: 'SET_CURRENT_PRODUCT', payload: product });
        
        // Load related products
        const related = mockProducts
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
        dispatch({ type: 'SET_RELATED_PRODUCTS', payload: related });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Product not found' });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load product' });
    }
  };

  const searchProducts = async (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    await loadProducts({ searchQuery: query, ...state.filters });
  };

  const filterProducts = async (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    await loadProducts({ ...state.filters, ...newFilters, searchQuery: state.searchQuery });
  };

  const sortProducts = (sortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
    
    const sorted = [...state.products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.isNew - a.isNew;
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    
    dispatch({ type: 'SET_PRODUCTS', payload: sorted });
  };

  const getProductsByCategory = async (categoryId) => {
    await loadProducts({ category: categoryId });
  };

  const addProductReview = (review) => {
    dispatch({ type: 'ADD_REVIEW', payload: review });
  };

  const updateProductStock = (productId, newStock) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { id: productId, stock: newStock } });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
    loadProducts();
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getCategoryById = (categoryId) => {
    return state.categories.find(cat => cat.id === categoryId);
  };

  const getProductsInPriceRange = (minPrice, maxPrice) => {
    return state.products.filter(p => p.price >= minPrice && p.price <= maxPrice);
  };

  const getTopRatedProducts = (limit = 5) => {
    return [...state.products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  };

  const getNewProducts = (limit = 5) => {
    return state.products.filter(p => p.isNew).slice(0, limit);
  };

  const getProductsByArtisan = (artisanName) => {
    return state.products.filter(p => p.artisan === artisanName);
  };

  const getProductsByDistrict = (district) => {
    return state.products.filter(p => p.district === district);
  };

  const value = {
    // State
    ...state,
    
    // Actions
    loadProducts,
    loadCategories,
    loadFeaturedProducts,
    getProductById,
    searchProducts,
    filterProducts,
    sortProducts,
    getProductsByCategory,
    addProductReview,
    updateProductStock,
    resetFilters,
    clearError,
    
    // Utility functions
    getCategoryById,
    getProductsInPriceRange,
    getTopRatedProducts,
    getNewProducts,
    getProductsByArtisan,
    getProductsByDistrict
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export { ProductContext };
