import { useState, useEffect } from 'react';
import { sellerAPI } from '../utils/api';

export const useSellerApproval = () => {
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkApproval = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerStatus();
      setIsApproved(response.data.isApproved);
      setError(null);
    } catch (err) {
      console.error('Error checking seller approval:', err);
      setError('Failed to check seller status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApproval();
  }, []);

  return {
    isApproved,
    loading,
    error,
    recheckApproval: checkApproval
  };
};

export default useSellerApproval;