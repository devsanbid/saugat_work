import React, { useState, useEffect } from 'react';
import { Store, Save, AlertCircle, CheckCircle, User, Phone, MapPin, Globe, FileText, CreditCard, Building } from 'lucide-react';
import { sellerAPI } from '../../../utils/api';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    businessName: '',
    businessType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    websiteUrl: '',
    taxNumber: '',
    bankAccount: {
      accountNumber: '',
      bankName: '',
      accountHolder: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerSettings();
      if (response.success) {
        const { profile } = response.data;
        setProfileData({
          businessName: profile.storeName || '',
          businessType: '',
          firstName: profile.ownerName?.split(' ')[0] || '',
          lastName: profile.ownerName?.split(' ').slice(1).join(' ') || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          description: profile.description || '',
          websiteUrl: profile.websiteUrl || '',
          taxNumber: '',
          bankAccount: {
            accountNumber: '',
            bankName: '',
            accountHolder: ''
          }
        });
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
        profile: {
          storeName: profileData.businessName,
          phone: profileData.phone,
          address: profileData.address,
          description: profileData.description,
          websiteUrl: profileData.websiteUrl
        }
      });
      
      if (response.success) {
        setSuccess('Store profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Store className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          </div>
          <p className="text-gray-600">Manage your store profile and business information</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Store Profile Section */}
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="text-blue-600" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Store Profile</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={profileData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={profileData.firstName}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={profileData.lastName}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</div>
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                       type="tel"
                       value={profileData.phone}
                       onChange={(e) => handleInputChange('phone', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                       placeholder="Enter your phone number"
                     />
                   </div>
                 </div>
               </div>

               {/* Business Details */}
               <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Business Details</h3>
                 
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                   <div className="relative">
                     <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                     <select
                       value={profileData.businessType}
                       onChange={(e) => handleInputChange('businessType', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                     >
                       <option value="">Select business type</option>
                       <option value="individual">Individual</option>
                       <option value="company">Company</option>
                       <option value="partnership">Partnership</option>
                       <option value="corporation">Corporation</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Number</label>
                   <div className="relative">
                     <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                     <input
                       type="text"
                       value={profileData.taxNumber}
                       onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                       placeholder="Enter your tax number"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account</label>
                   <div className="relative">
                     <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                     <input
                       type="text"
                       value={profileData.bankAccount}
                       onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                       placeholder="Enter your bank account number"
                     />
                   </div>
                 </div>
               </div>
             </div>

             {/* Contact Information */}
             <div className="mt-8 space-y-6">
               <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Contact Information</h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                   <div className="relative">
                     <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                     <textarea
                       value={profileData.address}
                       onChange={(e) => handleInputChange('address', e.target.value)}
                       rows={3}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                       placeholder="Enter your business address"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                   <div className="relative">
                     <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                     <input
                       type="url"
                       value={profileData.websiteUrl}
                       onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                       placeholder="https://your-website.com"
                     />
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Store Description</label>
                 <div className="relative">
                   <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                   <textarea
                     value={profileData.description}
                     onChange={(e) => handleInputChange('description', e.target.value)}
                     rows={4}
                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                     placeholder="Describe your store and what you sell..."
                   />
                 </div>
               </div>
             </div>

             {/* Save Button */}
             <div className="mt-8 pt-6 border-t border-gray-200">
               <div className="flex justify-end">
                 <button
                   onClick={handleSaveProfile}
                   disabled={saving}
                   className="px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                 >
                   {saving ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       <span>Saving...</span>
                     </>
                   ) : (
                     <>
                       <Save size={18} />
                       <span>Save Changes</span>
                     </>
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default Settings;
