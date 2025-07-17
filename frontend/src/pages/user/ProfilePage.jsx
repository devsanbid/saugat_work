import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  GiftIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import { AuthContext } from '../.././context/AuthContext';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    city: user?.city || '',
    district: user?.district || '',
    zone: user?.zone || '',
    preferences: {
      newsletter: user?.preferences?.newsletter || false,
      smsNotifications: user?.preferences?.smsNotifications || false,
      emailNotifications: user?.preferences?.emailNotifications || true,
      orderUpdates: user?.preferences?.orderUpdates || true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const nepalDistricts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Pokhara', 'Butwal',
    'Biratnagar', 'Janakpur', 'Nepalgunj', 'Dharan', 'Hetauda', 'Itahari'
  ];

  const nepalZones = [
    'Central', 'Eastern', 'Western', 'Mid-Western', 'Far-Western'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    

  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        await updateProfile(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } catch (err) {
        console.error('Profile update error:', err);
        alert('Failed to update profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePassword()) {
      setLoading(true);
      try {
        await changePassword(passwordData.currentPassword, passwordData.newPassword);
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } catch (err) {
        console.error('Password change error:', err);
        alert('Failed to change password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
      city: user?.city || '',
      district: user?.district || '',
      zone: user?.zone || '',
      preferences: {
        newsletter: user?.preferences?.newsletter || false,
        smsNotifications: user?.preferences?.smsNotifications || false,
        emailNotifications: user?.preferences?.emailNotifications || true,
        orderUpdates: user?.preferences?.orderUpdates || true
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price).replace('NPR', 'Rs. ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-6xl font-bold backdrop-blur-sm">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIconSolid className="h-16 w-16 text-white" />
                  )}
                </div>
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <CameraIcon className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  स्वागतम्! Welcome to your profile
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  <Badge variant="success" className="bg-green-500 text-white">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Verified Account
                  </Badge>
                  {user.isVip && (
                    <Badge variant="warning" className="bg-yellow-500 text-white">
                      <StarIcon className="h-4 w-4 mr-1" />
                      VIP Member
                    </Badge>
                  )}
                  <Badge variant="info" className="bg-blue-500 text-white">
                    Member since {formatDate(user.createdAt)}
                  </Badge>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Information Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        variant="nepal"
                        size="sm"
                        loading={loading}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        error={errors.firstName}
                        icon={UserIcon}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        error={errors.lastName}
                        icon={UserIcon}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        icon={EnvelopeIcon}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={errors.phone}
                        icon={PhoneIcon}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Street Address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          icon={MapPinIcon}
                          disabled={!isEditing}
                          placeholder="House no., Street name, Area"
                        />
                      </div>
                      <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District
                        </label>
                        <select
                          value={formData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <option value="">Select District</option>
                          {nepalDistricts.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zone
                        </label>
                        <select
                          value={formData.zone}
                          onChange={(e) => handleInputChange('zone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <option value="">Select Zone</option>
                          {nepalZones.map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>

              {/* Account Security */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsPasswordModalOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}



        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            error={passwordErrors.currentPassword}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            error={passwordErrors.newPassword}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            error={passwordErrors.confirmPassword}
            required
          />
          <div className="flex space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="nepal"
              loading={loading}
              className="flex-1"
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Change Profile Photo"
        size="md"
      >
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Photo</h3>
          <p className="text-gray-600 mb-6">
            Choose a photo that represents you well. It will be visible to other users.
          </p>
          <div className="space-y-4">
            <Button variant="nepal" fullWidth>
              Choose from Gallery
            </Button>
            <Button variant="outline" fullWidth>
              Take Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
