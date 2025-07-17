export const mockData = {
  stats: {
    totalProducts: 156,
    totalOrders: 2340,
    totalRevenue: 45670,
    totalCustomers: 890
  },
  recentOrders: [
    { id: '#ORD001', customer: 'John Doe', amount: 1749, status: 'pending', date: '2024-01-15' },
    { id: '#ORD002', customer: 'Jane Smith', amount: 2890, status: 'shipped', date: '2024-01-14' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: 1249, status: 'delivered', date: '2024-01-13' },
    { id: '#ORD004', customer: 'Sarah Wilson', amount: 3450, status: 'pending', date: '2024-01-12' }
  ],
  topProducts: [
    { 
      id: 1, 
      name: 'T-shirt with Tape Details', 
      price: 1749, 
      stock: 45, 
      rating: 4.5, 
      reviews: 123
    },
    { 
      id: 2, 
      name: 'Designer Hoodie', 
      price: 2890, 
      stock: 23, 
      rating: 4.7, 
      reviews: 89
    },
    { 
      id: 3, 
      name: 'Casual Jeans', 
      price: 1249, 
      stock: 67, 
      rating: 4.3, 
      reviews: 156
    }
  ],
  products: [
    { 
      id: 1, 
      name: 'T-shirt with Tape Details', 
      price: 1749, 
      stock: 45, 
      rating: 4.5, 
      reviews: 123,
      category: 'clothing',
      description: 'Premium quality t-shirt with unique tape details'
    },
    { 
      id: 2, 
      name: 'Designer Hoodie', 
      price: 2890, 
      stock: 23, 
      rating: 4.7, 
      reviews: 89,
      category: 'clothing',
      description: 'Comfortable designer hoodie for casual wear'
    },
    { 
      id: 3, 
      name: 'Casual Jeans', 
      price: 1249, 
      stock: 67, 
      rating: 4.3, 
      reviews: 156,
      category: 'clothing',
      description: 'Stylish casual jeans for everyday wear'
    },
    { 
      id: 4, 
      name: 'Wireless Headphones', 
      price: 3450, 
      stock: 12, 
      rating: 4.8, 
      reviews: 234,
      category: 'electronics',
      description: 'High-quality wireless headphones with noise cancellation'
    },
    { 
      id: 5, 
      name: 'Leather Wallet', 
      price: 890, 
      stock: 78, 
      rating: 4.2, 
      reviews: 67,
      category: 'accessories',
      description: 'Premium leather wallet with multiple compartments'
    },
    { 
      id: 6, 
      name: 'Plant Pot Set', 
      price: 1200, 
      stock: 34, 
      rating: 4.6, 
      reviews: 45,
      category: 'home',
      description: 'Beautiful ceramic plant pot set for home decoration'
    }
  ]
};

export const categories = [
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
  { id: 'home', name: 'Home & Garden', icon: '🏠' }
];

export const orderStatuses = [
  { id: 'pending', name: 'Pending', color: 'yellow' },
  { id: 'confirmed', name: 'Confirmed', color: 'blue' },
  { id: 'shipped', name: 'Shipped', color: 'purple' },
  { id: 'delivered', name: 'Delivered', color: 'green' },
  { id: 'cancelled', name: 'Cancelled', color: 'red' }
];
