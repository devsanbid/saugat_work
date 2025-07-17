import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - replace with actual API call
  const mockOrders = [
    {
      id: 'DOK-2025-001',
      date: '2025-07-15',
      status: 'delivered',
      total: 15750,
      items: [
        { name: 'Traditional Sarangi', price: 12000, quantity: 1, image: '/api/placeholder/80/80' },
        { name: 'Khukuri Knife', price: 3750, quantity: 1, image: '/api/placeholder/80/80' }
      ],
      deliveryAddress: 'Thamel, Kathmandu',
      trackingNumber: 'DOK-TRK-001'
    },
    {
      id: 'DOK-2025-002',
      date: '2025-07-10',
      status: 'processing',
      total: 4200,
      items: [
        { name: 'Dhaka Topi', price: 1200, quantity: 1, image: '/api/placeholder/80/80' },
        { name: 'Nepali Honey', price: 1500, quantity: 2, image: '/api/placeholder/80/80' }
      ],
      deliveryAddress: 'Lalitpur, Nepal',
      trackingNumber: 'DOK-TRK-002'
    },
    {
      id: 'DOK-2025-003',
      date: '2025-07-05',
      status: 'shipped',
      total: 8900,
      items: [
        { name: 'Thanka Painting', price: 8900, quantity: 1, image: '/api/placeholder/80/80' }
      ],
      deliveryAddress: 'Bhaktapur, Nepal',
      trackingNumber: 'DOK-TRK-003'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { variant: 'warning', icon: ClockIcon, text: 'Pending' },
      processing: { variant: 'info', icon: ClockIcon, text: 'Processing' },
      shipped: { variant: 'primary', icon: TruckIcon, text: 'Shipped' },
      delivered: { variant: 'success', icon: CheckCircleIcon, text: 'Delivered' },
      cancelled: { variant: 'danger', icon: XCircleIcon, text: 'Cancelled' }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'highest') return b.total - a.total;
    if (sortBy === 'lowest') return a.total - b.total;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm rounded-full transition-colors capitalize ${
                  filter === status
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-8xl mb-4 opacity-50">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping for authentic Nepali products!"
                : `No orders found with status: ${filter}`
              }
            </p>
            <Link to="/categories">
              <Button variant="nepal" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          sortedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <Badge variant={statusConfig.variant} className="flex items-center space-x-1">
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusConfig.text}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center hidden">
                            <span className="text-2xl opacity-50">🎨</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TruckIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Delivery Address:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{order.deliveryAddress}</p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600 ml-6 mt-1">
                      Tracking: <span className="font-medium">{order.trackingNumber}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download Invoice</span>
                  </Button>

                  {order.status === 'shipped' && (
                    <Button variant="nepal" size="sm">
                      Track Package
                    </Button>
                  )}

                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      Leave Review
                    </Button>
                  )}

                  {order.status === 'pending' && (
                    <Button variant="danger" size="sm">
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
