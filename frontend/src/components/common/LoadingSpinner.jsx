import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const SpinnerComponent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Nepal-themed spinner */}
      <div className="relative">
        {/* Outer ring - Nepal flag colors */}
        <div className={`${sizeClasses[size]} border-4 border-red-200 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner decorative element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600 animate-pulse">
            <span className="text-lg">🏔️</span>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
        {text}
      </div>
      
      {/* Decorative dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <SpinnerComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <SpinnerComponent />
    </div>
  );
};

// Alternative Nepal-themed loading animations
export const DokoSpinner = ({ size = 'md' }) => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin">
        <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl animate-bounce">🧺</span>
      </div>
    </div>
    <p className="text-gray-600 font-medium">Loading Doko...</p>
  </div>
);

export const MountainSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin">
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl animate-pulse">🏔️</span>
      </div>
    </div>
    <p className="text-gray-600 font-medium">Loading from the Himalayas...</p>
  </div>
);

export default LoadingSpinner;
