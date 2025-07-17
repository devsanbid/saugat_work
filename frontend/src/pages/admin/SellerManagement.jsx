import React, { useState, useEffect } from 'react';
import { Store, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import { userAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const SellerManagementPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPendingApplications, setShowPendingApplications] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [processedApplications, setProcessedApplications] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [pendingApplications, setPendingApplications] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState({
    totalSellers: 0,
    activeSellers: 0,
    pendingApplications: 0,
    totalCommission: 0
  });

  // Custom formatCurrency function for Rs.
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const fetchSellers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getSellers({
        page,
        limit
      });
      setSellers(response.users || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalItems: response.totalUsers || 0
      });
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setError(error.message || 'Failed to fetch sellers');
      toast.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    try {
      const response = await userAPI.getSellerApplications({ status: 'pending' });
      setPendingApplications(response.sellers || []);
      setProcessedApplications(new Set());
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      toast.error('Failed to fetch pending applications');
    }
  };

  const calculateStats = () => {
    const totalSellers = sellers.length;
    const activeSellers = sellers.filter(s => s.isActive && s.sellerInfo?.isApproved).length;
    const pendingCount = pendingApplications.length;
    const totalCommission = sellers.reduce((sum, s) => {
      return sum + (s.sellerInfo?.totalSales * 0.1 || 0);
    }, 0);
    
    setStats({
      totalSellers,
      activeSellers,
      pendingApplications: pendingCount,
      totalCommission
    });
  };

  useEffect(() => {
    fetchSellers();
    fetchPendingApplications();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [sellers, pendingApplications]);

  const handleApprove = async (id) => {
    try {
      setProcessedApplications(prev => new Set([...prev, id]));
      await userAPI.approveSellerApplication(id, { approved: true });
      toast.success('Seller application approved successfully');
      fetchPendingApplications();
      fetchSellers();
    } catch (error) {
      console.error('Error approving seller:', error);
      toast.error(error.message || 'Failed to approve seller');
      setProcessedApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const rejectionReason = prompt('Please provide a reason for rejection:');
      if (rejectionReason) {
        setProcessedApplications(prev => new Set([...prev, id]));
        await userAPI.approveSellerApplication(id, { 
          approved: false, 
          rejectionReason 
        });
        toast.success('Seller application rejected');
        fetchPendingApplications();
      }
    } catch (error) {
      console.error('Error rejecting seller:', error);
      toast.error(error.message || 'Failed to reject seller');
      setProcessedApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setIsViewModalOpen(true);
  };

  const handleEditSeller = (seller) => {
    setSelectedSeller(seller);
    setIsEditModalOpen(true);
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      try {
        await userAPI.deleteUser(sellerId);
        toast.success('Seller deleted successfully');
        fetchSellers();
      } catch (error) {
        console.error('Error deleting seller:', error);
        toast.error(error.message || 'Failed to delete seller');
      }
    }
  };

  const handleAddSeller = async (sellerData) => {
    try {
      await userAPI.createUser({
        ...sellerData,
        role: 'seller'
      });
      toast.success('Seller created successfully');
      setIsAddModalOpen(false);
      fetchSellers();
      fetchPendingApplications();
    } catch (error) {
      console.error('Error creating seller:', error);
      toast.error(error.message || 'Failed to create seller');
    }
  };

  const handleSaveEdit = async (updatedSeller) => {
    try {
      const nameParts = updatedSeller.name.trim().split(' ');
      const updateData = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: updatedSeller.email,
        isActive: updatedSeller.status === 'active',
        'sellerInfo.isApproved': updatedSeller.status !== 'suspended'
      };
      
      await userAPI.updateUser(updatedSeller._id, updateData);
      toast.success('Seller updated successfully');
      setIsEditModalOpen(false);
      setSelectedSeller(null);
      fetchSellers();
    } catch (error) {
      console.error('Error updating seller:', error);
      toast.error(error.message || 'Failed to update seller');
    }
  };

  const handlePageChange = (page) => {
    fetchSellers(page);
  };

  const getSellerStatus = (seller) => {
    if (!seller.isActive) return 'suspended';
    if (!seller.sellerInfo?.isApproved) return 'pending';
    return 'active';
  };

  const filteredSellers = sellers.filter(seller => {
    if (activeFilter === 'all') return true;
    return getSellerStatus(seller) === activeFilter;
  });

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Seller</span>
            </button>
            <button 
              onClick={() => setShowPendingApplications(!showPendingApplications)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <Clock className="w-4 h-4" />
              <span>Pending Applications ({pendingApplications.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Sellers</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalSellers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Active Sellers</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? '...' : stats.activeSellers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Pending Applications</p>
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? '...' : stats.pendingApplications}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Commission</p>
            <p className="text-2xl font-bold text-purple-600">
              {loading ? '...' : formatCurrency(stats.totalCommission)}
            </p>
          </div>
        </div>

        {showPendingApplications && pendingApplications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Applications</h3>
              <button
                onClick={() => setShowPendingApplications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app._id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {app.sellerInfo?.businessName || `${app.firstName} ${app.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.email} • {app.sellerInfo?.businessType || 'Business'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!processedApplications.has(app._id) ? (
                        <>
                          <button
                            onClick={() => handleApprove(app._id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(app._id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Processing...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-4">
            {['all', 'active', 'pending', 'suspended'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading sellers...</div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          )}
          
          {!loading && !error && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No sellers found
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {seller.firstName} {seller.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{seller.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={getSellerStatus(seller)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.sellerInfo?.businessName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.sellerInfo?.rating > 0 ? (
                          <div className="flex items-center">
                            <span>{seller.sellerInfo.rating}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(seller.sellerInfo?.totalSales || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewSeller(seller)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditSeller(seller)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSeller(seller._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* View Seller Modal */}
        {isViewModalOpen && selectedSeller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Seller Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSeller.firstName} {selectedSeller.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <StatusBadge status={getSellerStatus(selectedSeller)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSeller.sellerInfo?.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Sales</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedSeller.sellerInfo?.totalSales || 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSeller.sellerInfo?.rating > 0 ? (
                        <span className="flex items-center">
                          {selectedSeller.sellerInfo.rating} <span className="text-yellow-400 ml-1">★</span>
                        </span>
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSeller.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Seller Modal */}
        {isEditModalOpen && selectedSeller && (
          <EditSellerModal 
            seller={selectedSeller} 
            onSave={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}

        {/* Add Seller Modal */}
        {isAddModalOpen && (
          <AddSellerModal 
            onSave={handleAddSeller}
            onCancel={() => setIsAddModalOpen(false)}
          />
        )}
      </div>
  );
};

// Edit Seller Modal Component
const EditSellerModal = ({ seller, onSave, onCancel }) => {
  const getSellerStatus = (seller) => {
    if (!seller.isActive) return 'suspended';
    if (!seller.sellerInfo?.isApproved) return 'pending';
    return 'active';
  };

  const [formData, setFormData] = React.useState({
    name: `${seller.firstName} ${seller.lastName}`,
    email: seller.email,
    status: getSellerStatus(seller)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...seller, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Seller</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
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

const AddSellerModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Seller</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
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
              Create Seller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerManagementPage;
