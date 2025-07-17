import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, X } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import { orderAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const OrderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0,
    cancelled: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Custom formatCurrency function for Rs.
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      
      const [ordersResponse, statsResponse] = await Promise.all([
        orderAPI.getAllOrders(params),
        orderAPI.getOrderStats()
      ]);
      
      setOrders(ordersResponse.orders || []);
      setPagination({
        page: ordersResponse.currentPage || 1,
        limit: pagination.limit,
        totalPages: ordersResponse.totalPages || 1,
        totalItems: ordersResponse.total || 0
      });
      
      const orderStats = statsResponse.stats || {};
      setStats({
        total: orderStats.totalOrders || 0,
        completed: orderStats.deliveredOrders || 0,
        processing: orderStats.processingOrders || 0,
        pending: orderStats.pendingOrders || 0,
        cancelled: orderStats.cancelledOrders || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, searchTerm]);

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(searchLower) ||
      order.user?.firstName?.toLowerCase().includes(searchLower) ||
      order.user?.lastName?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.seller?.businessName?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId, { reason: 'Cancelled by admin' });
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh the orders list
      } catch (err) {
        toast.error(err.message || 'Failed to cancel order');
      }
    }
  };

  const handleSaveEdit = async (updatedOrder) => {
    try {
      await orderAPI.updateOrderStatus(updatedOrder._id, { status: updatedOrder.status });
      toast.success('Order updated successfully');
      setIsEditModalOpen(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh the orders list
    } catch (err) {
      toast.error(err.message || 'Failed to update order');
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? '...' : stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {loading ? '...' : stats.processing}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? '...' : stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {loading ? '...' : stats.cancelled}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order._id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items && order.items.length > 0 && order.items[0].seller?.sellerInfo?.businessName 
                          ? order.items[0].seller.sellerInfo.businessName 
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Order Modal */}
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-sm text-gray-900">{selectedOrder._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.user ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seller</label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.items && selectedOrder.items.length > 0 && selectedOrder.items[0].seller?.sellerInfo?.businessName 
                      ? selectedOrder.items[0].seller.sellerInfo.businessName 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedOrder.totalAmount || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <StatusBadge status={selectedOrder.orderStatus} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Items Count</label>
                  <p className="text-sm text-gray-900">{selectedOrder.items?.length || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.shippingAddress ? 
                      `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} ${selectedOrder.shippingAddress.zipCode}` 
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Order Modal */}
        {isEditModalOpen && selectedOrder && (
          <EditOrderModal 
            order={selectedOrder} 
            onSave={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
  );
};

// Edit Order Modal Component
const EditOrderModal = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    status: order.orderStatus
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...order, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{order._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                Rs. {(order.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderManagementPage;
