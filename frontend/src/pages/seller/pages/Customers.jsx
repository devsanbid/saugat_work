import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Search, Filter, UserPlus, MessageCircle, Eye, Star, X, Send, Calendar, Package, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { sellerAPI } from '../../../utils/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

  useEffect(() => {
    loadCustomers();
  }, [currentPage, searchTerm]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerCustomers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      });
      setCustomers(response.customers || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOrders = async (customerId) => {
    try {
      setOrdersLoading(true);
      const response = await sellerAPI.getCustomerOrders(customerId, {
        page: ordersPage,
        limit: 5
      });
      setCustomerOrders(response.orders || []);
      setOrdersTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error loading customer orders:', error);
      toast.error('Failed to load customer orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'orders':
        return b.orders - a.orders;
      case 'joinedDate':
        return new Date(b.joinedDate) - new Date(a.joinedDate);
      default:
        return 0;
    }
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 40000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 20000) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped':
        return <Package size={16} className="text-blue-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const handleViewOrders = (customer) => {
    setSelectedCustomer(customer);
    setOrdersPage(1);
    setShowOrdersModal(true);
    loadCustomerOrders(customer._id);
  };

  const handleOrdersPageChange = (page) => {
    setOrdersPage(page);
    if (selectedCustomer) {
      loadCustomerOrders(selectedCustomer._id);
    }
  };

  const handleContact = (customer) => {
    setSelectedCustomer(customer);
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message via API
    console.log('Sending message to:', selectedCustomer.email);
    console.log('Subject:', contactSubject);
    console.log('Message:', contactMessage);
    
    // Show success message
    toast.success(`Message sent to ${selectedCustomer.name} successfully!`);
    
    // Reset form and close modal
    setContactMessage('');
    setContactSubject('');
    setShowContactModal(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Orders Modal Component
  const OrdersModal = () => {
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCustomer?.name}'s Orders
              </h2>
              <p className="text-gray-600">Total orders found</p>
            </div>
            <button 
              onClick={() => setShowOrdersModal(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <Package className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">#{order._id?.slice(-8) || 'N/A'}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">{formatCurrency(order.totalAmount || order.itemTotal || 0)}</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status || order.orderStatus)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || order.orderStatus)}`}>
                        {(order.status || order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.status || order.orderStatus || 'pending').slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {item.productName || item.product?.name || 'Unknown Product'} (x{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {!ordersLoading && customerOrders.length === 0 && (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No orders found for this customer</p>
            </div>
          )}

          {/* Pagination */}
          {ordersTotalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handleOrdersPageChange(ordersPage - 1)}
                disabled={ordersPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-600">
                Page {ordersPage} of {ordersTotalPages}
              </span>
              <button
                onClick={() => handleOrdersPageChange(ordersPage + 1)}
                disabled={ordersPage === ordersTotalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Contact Modal Component
  const ContactModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Contact {selectedCustomer?.name}
              </h2>
              <p className="text-gray-600">{selectedCustomer?.email}</p>
            </div>
            <button 
              onClick={() => setShowContactModal(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Enter message subject..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Quick Templates:</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setContactSubject('Order Follow-up');
                    setContactMessage('Hi ' + selectedCustomer?.name + ',\n\nI wanted to follow up on your recent order. How was your experience with us?\n\nBest regards,\nDoko Team');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 block"
                >
                  Order Follow-up Template
                </button>
                <button
                  onClick={() => {
                    setContactSubject('Special Offer');
                    setContactMessage('Hi ' + selectedCustomer?.name + ',\n\nWe have a special offer just for you! Get 20% off on your next order.\n\nBest regards,\nDoko Team');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 block"
                >
                  Special Offer Template
                </button>
                <button
                  onClick={() => {
                    setContactSubject('Thank You');
                    setContactMessage('Hi ' + selectedCustomer?.name + ',\n\nThank you for being a valued customer! We appreciate your continued support.\n\nBest regards,\nDoko Team');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 block"
                >
                  Thank You Template
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!contactSubject || !contactMessage}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
            <p className="text-gray-600 mt-1">Manage your customer relationships</p>
          </div>
        </div>
      </div>

{/* Stats Cards */}
<div className="flex justify-center items-center flex-wrap gap-30 px-4 py-8"> {/* Increased gap to gap-12 */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex-1 min-w-[250px] max-w-[300px]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Customers</p>
        <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <UserPlus className="text-blue-500" size={24} />
      </div>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex-1 min-w-[250px] max-w-[300px]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
        <p className="text-2xl font-bold text-gray-900">{customers.length > 0 ? formatCurrency(Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0))) : formatCurrency(0)}</p>
      </div>
      <div className="p-3 bg-green-50 rounded-full">
        <div className="text-green-500 text-2xl">💰</div>
      </div>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex-1 min-w-[250px] max-w-[300px]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Avg Rating</p>
        <p className="text-2xl font-bold text-gray-900">{customers.length > 0 ? (customers.reduce((sum, c) => sum + (c.rating || 0), 0) / customers.length).toFixed(1) : '0.0'}</p>
      </div>
      <div className="p-3 bg-purple-50 rounded-full">
        <Star className="text-purple-500" size={24} />
      </div>
    </div>
  </div>
</div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="orders">Sort by Orders</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="joinedDate">Sort by Joined Date</option>
          </select>
        </div>
      </div>

      {/* Customer Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCustomers.map((customer) => {
          const tierInfo = getCustomerTier(customer.totalSpent);
          return (
            <div key={customer._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getInitials(customer.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">Since {formatDate(customer.joinedDate)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {customer.isVip && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-1">
                      VIP
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
                    {tierInfo.tier}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{customer.address}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{customer.orders}</p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium text-gray-700">{(customer.rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">Rating</span>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewOrders(customer)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-medium"
                >
                  <Eye size={16} className="inline mr-1" />
                  View Orders
                </button>
                <button 
                  onClick={() => handleContact(customer)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <MessageCircle size={16} className="inline mr-1" />
                  Contact
                </button>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modals */}
      {showOrdersModal && <OrdersModal />}
      {showContactModal && <ContactModal />}
    </div>
  );
};

export default Customers;
