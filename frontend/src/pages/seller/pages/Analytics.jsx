import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Eye, Loader } from 'lucide-react';
import { sellerAPI } from '../../../utils/api';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mapping for categories
  const categoryColors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500'
  ];

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await sellerAPI.getSellerAnalytics({ timeRange });
      
      if (response.success) {
        // Add colors to categories
        const dataWithColors = {
          ...response.data,
          topCategories: response.data.topCategories.map((category, index) => ({
            ...category,
            color: categoryColors[index % categoryColors.length]
          }))
        };
        setAnalyticsData(dataWithColors);
      } else {
        throw new Error(response.message || 'Failed to load analytics');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError(error.message);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Utility functions
  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analyticsData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="text-red-500 mb-4">
          <BarChart3 size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Analytics</h3>
        <p className="text-gray-600 mb-4">{error || 'Failed to load analytics data'}</p>
        <button
          onClick={loadAnalytics}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const MetricCard = ({ title, value, trend, icon, trendDirection, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          <div className="flex items-center mt-3">
            {trendDirection === 'up' ? (
              <TrendingUp className="text-green-500" size={18} />
            ) : (
              <TrendingDown className="text-red-500" size={18} />
            )}
            <span className={`text-sm ml-2 font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend}% from last month
            </span>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
            <p className="text-gray-600 mt-1">Track your business performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
           
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Sales Growth"
          value={formatPercentage(analyticsData.salesTrend)}
          trend={Math.abs(analyticsData.salesTrend)}
          trendDirection={analyticsData.salesTrend >= 0 ? "up" : "down"}
          subtitle="Monthly increase"
          icon={<TrendingUp className="text-red-500" size={32} />}
        />
        <MetricCard
          title="Conversion Rate"
          value={formatPercentage(analyticsData.conversionRate)}
          trend={Math.abs(analyticsData.conversionRateTrend || 0)}
          trendDirection={analyticsData.conversionRateTrend >= 0 ? "up" : "down"}
          subtitle="Visitors to customers"
          icon={<BarChart3 className="text-red-500" size={32} />}
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(analyticsData.averageOrderValue)}
          trend={Math.abs(analyticsData.averageOrderValueTrend || 0)}
          trendDirection={analyticsData.averageOrderValueTrend >= 0 ? "up" : "down"}
          subtitle="Per transaction"
          icon={<PieChart className="text-red-500" size={32} />}
        />
        <MetricCard
          title="Return Rate"
          value={formatPercentage(analyticsData.returnRate)}
          trend={Math.abs(analyticsData.returnRateTrend || 0)}
          trendDirection={analyticsData.returnRateTrend <= 0 ? "up" : "down"}
          subtitle="Orders returned"
          icon={<TrendingDown className="text-red-500" size={32} />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Sales by Category</h3>
            <button className="text-red-500 hover:text-red-600 font-medium">
              <Eye size={18} className="inline mr-1" />
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(category.value)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Monthly Performance</h3>
            <button className="text-red-500 hover:text-red-600 font-medium">
              <Calendar size={18} className="inline mr-1" />
              Change Period
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {month.month}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{month.orders} orders</p>
                    <p className="text-sm text-gray-600">{month.visitors} visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-gray-900">{formatCurrency(month.sales)}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    {index > 0 && month.sales > analyticsData.monthlyData[index - 1].sales ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    {index > 0 ? Math.abs(((month.sales - analyticsData.monthlyData[index - 1].sales) / analyticsData.monthlyData[index - 1].sales) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Business Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-semibold text-gray-900 mb-2">Total Revenue</h4>
            <p className="text-blue-600 font-bold text-xl">{formatCurrency(analyticsData.totalRevenue || 0)}</p>
            <p className="text-sm text-gray-600 mt-1">Current period</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Total Orders</h4>
            <p className="text-green-600 font-bold text-xl">{analyticsData.totalOrders || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Orders processed</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl mb-2">👥</div>
            <h4 className="font-semibold text-gray-900 mb-2">Total Customers</h4>
            <p className="text-purple-600 font-bold text-xl">{analyticsData.totalCustomers || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Unique customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
