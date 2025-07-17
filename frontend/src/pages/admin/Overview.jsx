import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  DollarSign, 
  ShoppingBag, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';


const OverviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const getMetrics = () => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Users',
        value: dashboardData.stats.users.total.toLocaleString(),
        icon: <Users className="w-6 h-6" />,
        color: 'red'
      },
      {
        title: 'Active Sellers',
        value: dashboardData.stats.users.activeSellers.toLocaleString(),
        icon: <Store className="w-6 h-6" />,
        color: 'red'
      },
      {
        title: 'Total Orders',
        value: dashboardData.stats.orders.total.toLocaleString(),
        icon: <ShoppingBag className="w-6 h-6" />,
        color: 'red'
      },
      {
        title: 'Revenue',
        value: `Rs. ${dashboardData.stats.revenue.total.toLocaleString()}`,
        icon: <DollarSign className="w-6 h-6" />,
        color: 'green'
      }
    ];
  };

  const getRecentActivity = () => {
    if (!dashboardData || !dashboardData.recentOrders) return [];
    
    return dashboardData.recentOrders.slice(0, 5).map((order, index) => ({
      id: order._id,
      action: `Order ${order.orderNumber} placed by ${order.user?.firstName} ${order.user?.lastName}`,
      time: new Date(order.createdAt).toLocaleDateString(),
      type: 'order',
      status: order.orderStatus === 'delivered' ? 'success' : 
              order.orderStatus === 'pending' ? 'warning' : 'success'
    }));
  };

  const getPendingActions = () => {
    if (!dashboardData) return [];
    
    const actions = [];
    
    if (dashboardData.stats.users.sellers > dashboardData.stats.users.activeSellers) {
      actions.push({
        id: 1,
        action: 'Seller applications to review',
        count: dashboardData.stats.users.sellers - dashboardData.stats.users.activeSellers
      });
    }
    
    if (dashboardData.stats.products.lowStock > 0) {
      actions.push({
        id: 2,
        action: 'Products with low stock',
        count: dashboardData.stats.products.lowStock
      });
    }
    
    if (dashboardData.stats.orders.pending > 0) {
      actions.push({
        id: 3,
        action: 'Pending orders to process',
        count: dashboardData.stats.orders.pending
      });
    }
    
    return actions;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getDashboardStats();
        setDashboardData(response);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUserManagement = () => {
    navigate('/admin/UserManagement');
  };

  const handleReviewSellers = () => {
    navigate('/admin/sellermanagement');
  };

  const handleGenerateReport = () => {
    navigate('/admin/Financial');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-red-500" />
          <span className="text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metrics = getMetrics();

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        </div>

        {/* Simplified Metrics without Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${metric.color}-100 text-${metric.color}-600`}>
                  {metric.icon}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity and Pending Actions Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {getRecentActivity().length > 0 ? (
                getRecentActivity().map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              {getPendingActions().length > 0 ? (
                getPendingActions().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending actions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={handleUserManagement}
              className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </button>
            <button 
              onClick={handleReviewSellers}
              className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Store className="w-5 h-5" />
              <span>Review Sellers</span>
            </button>
            <button 
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default OverviewPage;
