import React, { useState } from 'react';
import { Bell, Plus, Trash2, AlertCircle, MessageSquare, Mail, Settings } from 'lucide-react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance will occur tonight from 2:00 AM to 4:00 AM EST.',
      timestamp: '2024-07-15 14:30:00',
      status: 'unread',
      priority: 'high',
      recipients: 'all_users'
    },
    {
      id: 2,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-12345 has been placed by John Doe for Rs. 29,999.',
      timestamp: '2024-07-15 13:45:00',
      status: 'read',
      priority: 'medium',
      recipients: 'sellers'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Processed',
      message: 'Commission payment of Rs. 1,25,000 has been processed for Fashion Hub.',
      timestamp: '2024-07-15 12:20:00',
      status: 'read',
      priority: 'low',
      recipients: 'sellers'
    },
    {
      id: 4,
      type: 'security',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected for user account.',
      timestamp: '2024-07-15 11:15:00',
      status: 'unread',
      priority: 'high',
      recipients: 'admins'
    },
    {
      id: 5,
      type: 'seller',
      title: 'New Seller Application',
      message: 'TechGadgets Plus has submitted a seller application for review.',
      timestamp: '2024-07-15 10:30:00',
      status: 'unread',
      priority: 'medium',
      recipients: 'admins'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notification.status === 'unread';
    if (activeTab === 'system') return notification.type === 'system';
    if (activeTab === 'orders') return notification.type === 'order';
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system': return <Settings className="w-5 h-5 text-blue-500" />;
      case 'order': return <Bell className="w-5 h-5 text-green-500" />;
      case 'payment': return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'security': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'seller': return <Mail className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  const CreateNotificationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      message: '',
      type: 'system',
      priority: 'medium',
      recipients: 'all_users'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newNotification = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'unread'
      };
      setNotifications([newNotification, ...notifications]);
      setFormData({
        title: '',
        message: '',
        type: 'system',
        priority: 'medium',
        recipients: 'all_users'
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Notification</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="system">System</option>
                    <option value="order">Order</option>
                    <option value="payment">Payment</option>
                    <option value="security">Security</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all_users">All Users</option>
                  <option value="sellers">Sellers Only</option>
                  <option value="admins">Admins Only</option>
                  <option value="customers">Customers Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Notification Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['all', 'unread', 'system', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`p-6 hover:bg-gray-50 ${notification.status === 'unread' ? 'bg-red-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {notification.status === 'unread' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{notification.timestamp}</span>
                      <span>Recipients: {notification.recipients}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Notification Modal */}
      <CreateNotificationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default NotificationsPage;
