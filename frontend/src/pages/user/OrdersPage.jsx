import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('doko_token') || sessionStorage.getItem('doko_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const params = filter !== 'all' ? { status: filter } : {};
      const result = await orderAPI.getUserOrders(params);

      setOrders(result.orders || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      if (err.message.includes('token') || err.message.includes('unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'processing':
      case 'confirmed':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
      case 'returned':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'pending':
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      confirmed: 'warning',
      cancelled: 'error',
      returned: 'error',
      pending: 'default'
    };
    return variants[status] || 'default';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  const getDeliveryInfo = (order) => {
    switch (order.orderStatus) {
      case 'delivered':
        return order.actualDelivery ? `Delivered on ${formatDate(order.actualDelivery)}` : 'Delivered';
      case 'shipped':
        return order.estimatedDelivery ? `Expected delivery: ${formatDate(order.estimatedDelivery)}` : 'Shipped';
      case 'processing':
      case 'confirmed':
        return order.estimatedDelivery ? `Expected delivery: ${formatDate(order.estimatedDelivery)}` : 'Processing';
      case 'cancelled':
        return 'Order cancelled';
      case 'pending':
        return 'Order pending confirmation';
      default:
        return 'Status unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrders} variant="nepal">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Track and manage your orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
              { key: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
              { key: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
              { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
              { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
              { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filter === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-8">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No Orders Found' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `You don't have any ${filter} orders at the moment.`
              }
            </p>
            <Button
              variant="nepal"
              onClick={() => navigate('/categories')}
            >
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.orderStatus)}
                        <Badge variant={getStatusBadge(order.orderStatus)} className="capitalize">
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Order #{order.orderNumber}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Ordered: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>Total: {formatPrice(order.totalAmount)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <TruckIcon className="h-4 w-4" />
                        <span>{getDeliveryInfo(order)}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {item.product?.name || 'Product'} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Tracking Number</p>
                            <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Implement tracking functionality
                              alert(`Track order: ${order.trackingNumber}`);
                            }}
                          >
                            Track Package
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-2 lg:w-48">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to order details
                        navigate(`/order/${order._id}`);
                      }}
                      className="flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                    
                    {order.orderStatus === 'delivered' && (
                      <Button
                        variant="nepal"
                        size="sm"
                        onClick={() => {
                          // Implement reorder functionality
                          alert('Reorder functionality coming soon!');
                        }}
                      >
                        Reorder
                      </Button>
                    )}
                    
                    {order.orderStatus === 'processing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Implement cancel order functionality
                          if (confirm('Are you sure you want to cancel this order?')) {
                            alert('Cancel order functionality coming soon!');
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;