import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Download, Eye, Package } from "lucide-react";
import { sellerAPI } from "../../../utils/api";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      const response = await sellerAPI.getSellerOrders(params);
      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}` : '';
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await sellerAPI.updateSellerOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "✅";
      case "shipped":
        return "🚚";
      case "pending":
      case "processing":
        return "⏳";
      case "cancelled":
      case "returned":
        return "❌";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Order Details
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                      <span className="ml-2 text-gray-600">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Package className="text-white" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.orderNumber || order._id}
                        </p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} item(s)</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.email || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-lg text-gray-900">
                      Rs{(order.totalAmount || order.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.orderStatus || order.items?.[0]?.status || 'pending'
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(order.orderStatus || order.items?.[0]?.status || 'pending')}
                      </span>
                      {(order.orderStatus || order.items?.[0]?.status || 'pending').charAt(0).toUpperCase() +
                        (order.orderStatus || order.items?.[0]?.status || 'pending').slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      
                      <select
                        value={order.orderStatus || order.items?.[0]?.status || 'pending'}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
