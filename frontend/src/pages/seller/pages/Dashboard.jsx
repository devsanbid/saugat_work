import React, { useState, useEffect, useContext } from 'react';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star,
  ArrowUpRight,
  Plus,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  ShoppingCart,
  Activity,
  Target,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
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
    console.log('Dashboard component mounted, fetching data...');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      const response = await sellerAPI.getSellerDashboard();
      console.log('Dashboard API response:', response);
      console.log('Dashboard data received:', response);
      setDashboardData(response);
      console.log('Dashboard state updated with:', response);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Dashboard fetch error:', err);
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

  console.log('Current dashboard data state:', dashboardData);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full translate-y-36 -translate-x-36 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="text-white" size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Welcome back, {sellerName}!</h1>
                    <p className="text-blue-100 text-base sm:text-lg font-medium">✨ Seller Dashboard</p>
                  </div>
                </div>
                <p className="text-blue-100 text-lg sm:text-xl mb-8 font-light leading-relaxed">Here's your store performance overview and latest updates 🚀</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center space-x-3 border border-white/20 shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="text-white" size={14} />
                    </div>
                    <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center space-x-3 border border-green-300/30 shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Activity className="text-white" size={14} />
                    </div>
                    <span className="text-sm font-semibold">🟢 Store Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-white to-gray-50 text-purple-700 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:from-gray-50 hover:to-white hover:scale-105 transition-all duration-300 shadow-2xl border border-white/50"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                  <span>Add Product</span>
                </button>
                <button
                  onClick={handleViewAnalytics}
                  className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:from-white/30 hover:to-white/20 hover:scale-105 transition-all duration-300 border border-white/30 shadow-xl"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <BarChart3 size={16} className="text-white" />
                  </div>
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">Loading your dashboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 flex items-center space-x-4">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Unable to load dashboard</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        {!loading && !error && dashboardData && dashboardData.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Package className="text-red-600" size={24} />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Products</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalProducts || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Products in your store</p>
            </div>

            {/* Active Products Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Active Products</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.activeProducts || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Currently available</p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">+15%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">Rs{dashboardData.stats.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Lifetime earnings</p>
            </div>

            {/* Total Customers Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">+5%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Customers</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalCustomers || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Unique buyers</p>
            </div>
          </div>
        )}

        {/* Additional Performance Metrics */}
        {!loading && !error && dashboardData && dashboardData.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-white" size={32} />
                <div className="text-right">
                  <p className="text-orange-100 text-sm">This Month</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sales Target</h3>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold">Rs{Math.round((dashboardData.stats.totalRevenue || 0) * 0.3).toLocaleString()}</p>
                <p className="text-orange-200 text-sm">/ Rs{Math.round((dashboardData.stats.totalRevenue || 0) * 0.5).toLocaleString()}</p>
              </div>
              <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-3/5"></div>
              </div>
            </div>

            {/* Store Performance */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Zap className="text-white" size={32} />
                <div className="text-right">
                  <p className="text-indigo-100 text-sm">Performance</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Store Rating</h3>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">4.8</p>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="text-yellow-300 fill-current" size={16} />
                  ))}
                </div>
              </div>
              <p className="text-indigo-200 text-sm mt-2">Based on customer reviews</p>
            </div>

            {/* Order Status */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Truck className="text-white" size={32} />
                <div className="text-right">
                  <p className="text-teal-100 text-sm">Orders</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
              <p className="text-2xl font-bold">{dashboardData.recentOrders?.filter(order => order.status === 'pending').length || 0}</p>
              <p className="text-teal-200 text-sm mt-2">Require your attention</p>
            </div>
          </div>
        )}

      {/* Main Content Grid - Enhanced Layout */}
      {!loading && !error && dashboardData && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Orders Section - Enhanced */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                  <p className="text-sm text-gray-500">Latest customer orders</p>
                </div>
              </div>
              <button 
                onClick={handleViewAllOrders}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            {console.log('Recent orders data:', dashboardData.recentOrders)}
            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
               <div className="space-y-4">
                 {dashboardData.recentOrders.slice(0, 6).map((order) => (
                   <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-100">
                     <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                         <ShoppingCart className="text-gray-600" size={20} />
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900">Order #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</p>
                         <p className="text-sm text-gray-600">{order.customer?.firstName} {order.customer?.lastName}</p>
                         <div className="flex items-center space-x-2 mt-1">
                           <Clock className="text-gray-400" size={12} />
                           <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-gray-900 text-lg">Rs{order.totalAmount?.toLocaleString()}</p>
                       <div className="flex items-center justify-end mt-2">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                           order.status === 'completed' ? 'bg-green-100 text-green-700' :
                           order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                           order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                           'bg-gray-100 text-gray-700'
                         }`}>
                           {order.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                           {order.status === 'pending' && <Clock size={12} className="mr-1" />}
                           {order.status === 'processing' && <Activity size={12} className="mr-1" />}
                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="text-gray-400" size={32} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Recent Orders</h4>
                <p className="text-gray-500">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>

          {/* Top Products Section - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
                  <p className="text-sm text-gray-500">Best selling items</p>
                </div>
              </div>
            </div>
            
            {console.log('Top products data:', dashboardData.topProducts)}
            {dashboardData.topProducts && dashboardData.topProducts.length > 0 ? (
               <div className="space-y-4">
                 {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                   <div key={product._id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-100">
                     <div className="flex-shrink-0 mr-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                         index === 0 ? 'bg-yellow-100' :
                         index === 1 ? 'bg-gray-100' :
                         index === 2 ? 'bg-orange-100' :
                         'bg-blue-100'
                       }`}>
                         <span className={`font-bold ${
                           index === 0 ? 'text-yellow-600' :
                           index === 1 ? 'text-gray-600' :
                           index === 2 ? 'text-orange-600' :
                           'text-blue-600'
                         }`}>#{index + 1}</span>
                       </div>
                     </div>
                     <div className="flex-1">
                       <p className="font-semibold text-gray-900 mb-1">{product.name}</p>
                       <p className="text-sm text-gray-600 mb-2">Rs{product.price?.toLocaleString()}</p>
                       <div className="flex items-center space-x-4 text-xs text-gray-500">
                         <span className="flex items-center space-x-1">
                           <ShoppingCart size={12} />
                           <span>{product.salesCount || 0} sold</span>
                         </span>
                         <span className="flex items-center space-x-1">
                           <Package size={12} />
                           <span>{product.stock || 0} left</span>
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="text-gray-400" size={32} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Products Data</h4>
                <p className="text-gray-500 text-sm">Add products to see performance metrics</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Quick Actions - Enhanced */}
      {!loading && !error && dashboardData && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Manage your store efficiently</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Product */}
            <button 
              onClick={() => setShowProductForm(true)}
              className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-opacity-30 transition-all">
                  <Plus size={24} />
                </div>
                <h4 className="font-semibold mb-1">Add Product</h4>
                <p className="text-xs text-blue-100">Create new listing</p>
              </div>
            </button>

            {/* View Analytics */}
            <button 
              onClick={handleViewAnalytics}
              className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-opacity-30 transition-all">
                  <BarChart3 size={24} />
                </div>
                <h4 className="font-semibold mb-1">Analytics</h4>
                <p className="text-xs text-green-100">View insights</p>
              </div>
            </button>

            {/* Manage Orders */}
            <button 
              onClick={handleViewAllOrders}
              className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-opacity-30 transition-all">
                  <ShoppingCart size={24} />
                </div>
                <h4 className="font-semibold mb-1">Orders</h4>
                <p className="text-xs text-purple-100">Manage orders</p>
              </div>
            </button>

            {/* Store Settings */}
            <button 
              className="group bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-opacity-30 transition-all">
                  <Award size={24} />
                </div>
                <h4 className="font-semibold mb-1">Settings</h4>
                <p className="text-xs text-orange-100">Store profile</p>
              </div>
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
    </div>
  );
};

export default Dashboard;
