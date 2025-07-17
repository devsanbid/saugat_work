import React, { useState, useRef, useEffect, useContext } from 'react';
import { Search, Bell, X, Check, Clock, Menu, Package, ShoppingBag, Users, User, Eye, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';

const Header = ({ activeTab, searchQuery, setSearchQuery, setSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD001 from John Doe for Rs 1,749',
      time: '2 minutes ago',
      read: false,
      icon: <ShoppingBag size={16} className="text-blue-500" />
    },
    {
      id: 2,
      type: 'product',
      title: 'Low Stock Alert',
      message: 'T-shirt with Tape Details has only 5 items left',
      time: '1 hour ago',
      read: false,
      icon: <Package size={16} className="text-orange-500" />
    },
    {
      id: 3,
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Sarah Wilson just created an account',
      time: '3 hours ago',
      read: true,
      icon: <Users size={16} className="text-green-500" />
    }
  ]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUserProfile(response.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to user from context
        setUserProfile(user);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Get display data from userProfile or fallback to user
  const displayUser = userProfile || user;
  const fullName = displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : 'User';
  const businessName = displayUser?.sellerInfo?.businessName || 'Shop';
  const joinDate = displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navigate = useNavigate();

  const handleViewProfile = () => {
    setShowProfile(false);
    navigate('/seller/profile');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowProfile(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {/* Search - Hidden on mobile, visible on larger screens */}
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-32 sm:w-48 lg:w-64"
            />
          </div>
          
          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            notification.read ? 'bg-gray-50' : 'bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 pr-2">
                                  <p className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {notification.time}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                      title="Mark as read"
                                    >
                                      <Check size={14} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                                    title="Delete notification"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button className="w-full text-center text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                {displayUser?.avatar ? (
                  <img src={displayUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{fullName}</span>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                {/* Profile Header */}
                <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      {displayUser?.avatar ? (
                        <img src={displayUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{fullName}</h3>
                      <p className="text-red-100 text-sm">{displayUser?.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-green bg-opacity-20 px-2 py-1 rounded-full">
                          {businessName}
                        </span>
                        <span className="text-xs bg-green-500 bg-opacity-80 px-2 py-1 rounded-full">
                          {displayUser?.sellerInfo?.isApproved ? 'Approved' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="p-4 border-b border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{displayUser?.sellerInfo?.rating || '4.5'}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">Rs 0</p>
                      <p className="text-xs text-gray-500">Total Sales</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{joinDate}</p>
                      <p className="text-xs text-gray-500">Member Since</p>
                    </div>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="p-4">
                  <div className="space-y-2">
                    <button
                      onClick={handleViewProfile}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">View Profile</span>
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
