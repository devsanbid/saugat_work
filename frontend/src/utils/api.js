const API_BASE_URL = 'http://localhost:1919/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('doko_token') || sessionStorage.getItem('doko_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    let url = endpoint;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.keys(options.params).forEach(key => {
        if (options.params[key] !== undefined && options.params[key] !== null) {
          searchParams.append(key, options.params[key]);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request(url, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
      ...options,
    });
  }
}

const api = new ApiClient();

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const userAPI = {
  createUser: (data) => api.post('/users', data),
  getUsers: (params) => api.get('/users', { params }),
  getSellers: (params) => api.get('/users?role=seller', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: (id) => api.get(`/users/stats/${id}`),
  toggleUserStatus: (id) => api.patch(`/users/${id}/toggle-status`),
  getSellerApplications: (params) => api.get('/users/seller-applications', { params }),
  approveSellerApplication: (id, data) => api.put(`/users/seller-applications/${id}/approve`, data),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query, params) => api.get(`/products/search?q=${query}`, { params }),
  getProductReviews: (id, params) => api.get(`/products/${id}/reviews`, { params }),
  addProductReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  getCategoryProducts: (id, params) => api.get(`/categories/${id}/products`, { params }),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  getMainCategories: () => api.get('/categories/main'),
  getCategoryStats: (id) => api.get(`/categories/${id}/stats`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (data) => api.put('/cart/update', data),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
  applyCoupon: (data) => api.post('/cart/coupon/apply', data),
  removeCoupon: () => api.delete('/cart/coupon/remove'),
  getCartSummary: () => api.get('/cart/summary'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist/add', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  clearWishlist: () => api.delete('/wishlist/clear'),
  moveToCart: (data) => api.post('/wishlist/move-to-cart', data),
  moveAllToCart: () => api.post('/wishlist/move-all-to-cart'),
  checkProductInWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  getWishlistSummary: () => api.get('/wishlist/summary'),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id, data) => api.put(`/orders/${id}/cancel`, data),
  getAllOrders: (params) => api.get('/orders/all', { params }),
  getSellerOrders: (params) => api.get('/orders/seller-orders', { params }),
  getOrderStats: (params) => api.get('/orders/stats', { params }),
  addTrackingUpdate: (id, data) => api.post(`/orders/${id}/tracking`, data),
};

export const adminAPI = {
  getDashboardStats: (params) => api.get('/admin/dashboard/stats', { params }),
  getSystemHealth: () => api.get('/admin/system/health'),
  getReports: (params) => api.get('/admin/reports', { params }),
  getFinancialReports: (params) => api.get('/admin/financial-reports', { params }),
  getSystemLogs: (params) => api.get('/admin/logs', { params }),
  manageUsers: (action, userId, data) => api.post(`/admin/users/${action}/${userId}`, data),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  getAllCoupons: (params) => api.get('/admin/coupons', { params }),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
};

export const sellerAPI = {
  getSellerProducts: (params) => api.get('/sellers/products', { params }),
  createSellerProduct: (data) => api.post('/sellers/products', data),
  updateSellerProduct: (id, data) => api.put(`/sellers/products/${id}`, data),
  deleteSellerProduct: (id) => api.delete(`/sellers/products/${id}`),
  getSellerOrders: (params) => api.get('/sellers/orders', { params }),
  updateSellerOrderStatus: (id, data) => api.put(`/sellers/orders/${id}/status`, data),
  addSellerTrackingUpdate: (id, data) => api.post(`/sellers/orders/${id}/tracking`, data),
  getSellerDashboard: () => api.get('/sellers/dashboard'),
  getSellerStatus: () => api.get('/sellers/status'),
  getSellerAnalytics: (params) => api.get('/sellers/analytics', { params }),
  getSellerCustomers: (params) => api.get('/sellers/customers', { params }),
  getCustomerOrders: (customerId, params) => api.get(`/sellers/customers/${customerId}/orders`, { params }),
  getSellerSettings: () => api.get('/sellers/settings'),
  updateSellerSettings: (data) => api.put('/sellers/settings', data),
  // Coupon endpoints
  getSellerCoupons: (params) => api.get('/sellers/coupons', { params }),
  getSellerCouponById: (id) => api.get(`/sellers/coupons/${id}`),
  createSellerCoupon: (data) => api.post('/sellers/coupons', data),
  updateSellerCoupon: (id, data) => api.put(`/sellers/coupons/${id}`, data),
  deleteSellerCoupon: (id) => api.delete(`/sellers/coupons/${id}`),
};

// Other API modules are already exported above
// Additional exports can be added here if needed

export default api;