import React, { useState, useEffect, useContext } from 'react';
import { Package, ShoppingBag, DollarSign, Users, Star, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import ProductForm from '../../../components/common/ProductForm';
import { sellerAPI, authAPI } from '../../../utils/api';
import { AuthContext } from '../../../context/AuthContext';

const Dashboard = ({ onTabChange }) => {
  const { user } = useContext(AuthContext);
  
  // Get seller's full name
  const sellerName = user ? `${user.firstName} ${user.lastName}` : 'Seller';
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0
    },
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerDashboard();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 403 && err.response?.data?.message?.includes('not approved')) {
        setError('Your seller account is pending approval. Please wait for admin verification.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleViewAnalytics = () => {
    if (onTabChange) {
      onTabChange('analytics');
    }
  };



  const handleSaveProduct = (productData) => {
    console.log('Saving product:', productData);
    alert('Product added successfully!');
    setShowProductForm(false);
  };

  const handleViewAllOrders = () => {
    if (onTabChange) {
      onTabChange('orders');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section - Fully Responsive */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back, {sellerName}!</h1>
            <p className="text-red-100 text-sm sm:text-base lg:text-lg">Here's what's happening with your store today</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ShoppingBag size={28} className="text-white sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards - Responsive Grid */}
      {!loading && !error && dashboardData && dashboardData.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Total Products" 
            value={dashboardData.stats.totalProducts || 0} 
            icon={<Package className="text-red-500" size={24} />}
            trend={12}
            color="red"
          />
          <StatCard 
            title="Active Products" 
            value={dashboardData.stats.activeProducts || 0} 
            icon={<ShoppingBag className="text-blue-500" size={24} />}
            trend={8}
            color="blue"
          />
          <StatCard 
            title="Total Revenue" 
            value={`Rs${dashboardData.stats.totalRevenue?.toLocaleString() || 0}`} 
            icon={<DollarSign className="text-green-500" size={24} />}
            trend={15}
            color="green"
          />
          <StatCard 
            title="Total Customers" 
            value={dashboardData.stats.totalCustomers || 0} 
            icon={<Users className="text-purple-500" size={24} />}
            trend={5}
            color="purple"
          />
        </div>
      )}

      {/* Main Content Grid - Responsive Layout */}
      {!loading && !error && dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders - Responsive */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Orders</h3>
                <button 
                  onClick={handleViewAllOrders}
                  className="text-red-500 hover:text-red-600 font-medium flex items-center space-x-1 transition-colors text-sm sm:text-base"
                >
                  <span>View All</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order, index) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.id}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-gray-900 text-base sm:text-lg">Rs{order.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>No recent orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products - Responsive */}
        <div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Top Products</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {dashboardData.topProducts && dashboardData.topProducts.length > 0 ? (
                dashboardData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="text-gray-500" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-red-600 font-bold text-sm sm:text-base">Rs{product.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400 fill-current" size={10} />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>No top products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
      {/* Quick Actions - Responsive */}
      {!loading && !error && dashboardData && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
  {/* Increased gap to gap-12 for more space */}
  <div className="flex flex-wrap justify-center gap-12">
    <button
      onClick={handleAddProduct}
      className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
    >
      <Package size={20} />
      <span className="font-medium text-sm sm:text-base">Add New Product</span>
    </button>
    <button
      onClick={handleViewAnalytics}
      className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
    >
      <Eye size={20} />
      <span className="font-medium text-sm sm:text-base">View Analytics</span>
    </button>
        </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          onSave={handleSaveProduct}
          onClose={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
