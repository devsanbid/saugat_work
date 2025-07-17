import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-red-100 text-red-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    nepal: 'bg-gradient-to-r from-red-100 to-blue-100 text-red-800',
    cultural: 'bg-gradient-to-r from-yellow-100 to-red-100 text-yellow-800',
    himalayan: 'bg-gradient-to-r from-blue-100 to-white text-blue-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-300
    ${variants[variant]}
    ${sizes[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${className}
  `;

  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
};

// Notification Badge Component
export const NotificationBadge = ({ count, max = 99, className = '' }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count === 0) return null;

  return (
    <Badge
      variant="danger"
      size="sm"
      className={`
        absolute -top-1 -right-1 min-w-[1.25rem] h-5 
        bg-red-600 text-white border-2 border-white
        animate-pulse
        ${className}
      `}
    >
      {displayCount}
    </Badge>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, children, className = '' }) => {
  const statusVariants = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    error: 'danger',
    processing: 'info',
    delivered: 'success',
    shipped: 'info',
    cancelled: 'danger'
  };

  return (
    <Badge
      variant={statusVariants[status] || 'default'}
      className={`font-semibold ${className}`}
    >
      {children || status}
    </Badge>
  );
};

// Category Badge Component
export const CategoryBadge = ({ category, className = '' }) => {
  const categoryVariants = {
    'musical-instruments': 'nepal',
    'handicrafts': 'cultural',
    'grocery': 'success',
    'tools-crafts': 'secondary',
    'clothing': 'himalayan'
  };

  return (
    <Badge
      variant={categoryVariants[category] || 'default'}
      className={`capitalize ${className}`}
    >
      {category?.replace('-', ' ')}
    </Badge>
  );
};

export default Badge;
