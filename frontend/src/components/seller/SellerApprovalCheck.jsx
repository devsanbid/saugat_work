import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Mail, Phone, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sellerAPI } from '../../utils/api';

const SellerApprovalCheck = ({ children, onApprovalChange }) => {
  const { user } = useAuth();
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkSellerApproval();
  }, []);

  const checkSellerApproval = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await sellerAPI.getSellerStatus();
      const newApprovalStatus = response.data.isApproved;
      
      // If approval status changed from false to true, notify parent
      if (isApproved === false && newApprovalStatus === true && onApprovalChange) {
        onApprovalChange();
      }
      
      setIsApproved(newApprovalStatus);
      setError(null);
    } catch (err) {
      console.error('Error checking seller approval:', err);
      setError('Failed to check seller status');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking seller status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => checkSellerApproval(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-yellow-600" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Shop Verification Pending
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for registering as a seller! Your shop is currently under review by our admin team. 
            Please wait for admin verification to access your seller dashboard.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Our team will review your seller application</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• The review process typically takes 1-3 business days</li>
            </ul>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@doko.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+977-1-234-5678</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => checkSellerApproval(true)}
            disabled={isRefreshing}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isRefreshing && <RefreshCw className="animate-spin" size={16} />}
            <span>{isRefreshing ? 'Checking...' : 'Check Status Again'}</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default SellerApprovalCheck;