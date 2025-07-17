import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusStyle = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      banned: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
