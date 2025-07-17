import React, { useState, useEffect } from 'react';
import { sellerAPI } from '../../../utils/api';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    websiteUrl: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    marketingEmails: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerSettings();
      if (response.success) {
        setProfileData(response.data.profile);
        setNotificationSettings(response.data.notifications);
      }
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await sellerAPI.updateSellerSettings({
        profile: profileData
      });
      
      if (response.success) {
        setSuccess('Profile updated successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await sellerAPI.updateSellerSettings({
        notifications: notificationSettings
      });
      
      if (response.success) {
        setSuccess('Notification settings updated successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await sellerAPI.updateSellerSettings({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setSuccess('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  const menuItems = [
    { id: 'profile', label: 'Store Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];

  const SettingsNav = () => (
    <div className="w-64 bg-white border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-3 py-2 rounded ${
              activeSection === item.id 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const ProfileSettings = () => (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6">Store Profile</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              value={profileData.storeName}
              onChange={(e) => setProfileData({...profileData, storeName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input
              type="text"
              value={profileData.ownerName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
          <textarea
            value={profileData.description}
            onChange={(e) => setProfileData({...profileData, description: e.target.value})}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
          <input
            type="url"
            value={profileData.websiteUrl}
            onChange={(e) => setProfileData({...profileData, websiteUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
  const NotificationSettings = () => (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6">Notification Settings</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        {[
          {
            key: 'orderNotifications',
            title: 'Order Notifications',
            description: 'Get notified when you receive new orders'
          },
          {
            key: 'emailAlerts',
            title: 'Email Alerts',
            description: 'Receive important updates via email'
          },
          {
            key: 'smsAlerts',
            title: 'SMS Alerts',
            description: 'Get SMS notifications for urgent matters'
          },
          {
            key: 'marketingEmails',
            title: 'Marketing Emails',
            description: 'Receive updates about new features and promotions'
          }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded">
            <div>
              <h4 className="font-medium text-gray-900">{setting.title}</h4>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[setting.key]}
                onChange={(e) => setNotificationSettings({...notificationSettings, [setting.key]: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleSaveNotifications}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleChangePassword}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your store settings and preferences</p>
        </div>

        <div className="flex space-x-8">
          <SettingsNav />
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
