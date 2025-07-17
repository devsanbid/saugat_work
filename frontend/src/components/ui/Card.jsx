import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const baseClasses = `
    bg-white 
    border border-gray-200 
    ${shadowClasses[shadow]} 
    ${roundedClasses[rounded]} 
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-xl hover:border-red-200 transform hover:-translate-y-1 transition-all duration-300' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
