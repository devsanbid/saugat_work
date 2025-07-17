import React from 'react';

const ErrorIllustration = ({ type = '404', size = 'md', animated = true }) => {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  };

  const animations = animated ? 'animate-bounce' : '';

  const illustrations = {
    404: (
      <div className={`${sizes[size]} mx-auto relative`}>
        {/* Mountain Background */}
        <div className="absolute inset-0 flex items-end justify-center">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Mountains */}
            <path
              d="M0,120 L40,60 L80,80 L120,40 L160,70 L200,50 L200,120 Z"
              fill="url(#mountainGradient)"
              className="opacity-30"
            />
            <path
              d="M0,120 L30,80 L60,90 L100,50 L140,75 L180,60 L200,65 L200,120 Z"
              fill="url(#mountainGradient2)"
              className="opacity-40"
            />
            
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Empty Doko (Basket) */}
        <div className={`absolute inset-0 flex items-center justify-center ${animations}`}>
          <div className="text-center">
            <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              🧺
            </div>
            <div className="text-2xl text-gray-600 font-medium">
              Empty Basket
            </div>
            <div className="text-sm text-gray-500 mt-2">
              This path doesn't exist
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 text-2xl animate-pulse">🏔️</div>
        <div className="absolute bottom-4 left-4 text-xl animate-pulse opacity-60">🇳🇵</div>
      </div>
    ),

    500: (
      <div className={`${sizes[size]} mx-auto relative`}>
        {/* Server Error Temple */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 transform hover:rotate-12 transition-transform duration-300">
              🏛️
            </div>
            <div className="text-2xl text-gray-600 font-medium">
              Temple Under Maintenance
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Our servers are taking a break
            </div>
          </div>
        </div>
        
        {/* Repair Tools */}
        <div className="absolute top-2 right-2 text-xl animate-bounce">🔧</div>
        <div className="absolute bottom-2 left-2 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>⚙️</div>
      </div>
    ),

    network: (
      <div className={`${sizes[size]} mx-auto relative`}>
        {/* Network Error Yak */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              🐂
            </div>
            <div className="text-2xl text-gray-600 font-medium">
              Connection Lost
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Even our yaks can't find the signal
            </div>
          </div>
        </div>
        
        {/* Signal Bars */}
        <div className="absolute top-4 right-4 flex space-x-1">
          <div className="w-2 h-6 bg-gray-300 rounded"></div>
          <div className="w-2 h-8 bg-gray-300 rounded"></div>
          <div className="w-2 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    ),

    empty: (
      <div className={`${sizes[size]} mx-auto relative`}>
        {/* Empty State */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 opacity-60">
              🏮
            </div>
            <div className="text-2xl text-gray-600 font-medium">
              Nothing Here
            </div>
            <div className="text-sm text-gray-500 mt-2">
              This section is empty
            </div>
          </div>
        </div>
        
        {/* Wind Effect */}
        <div className="absolute top-8 right-8 text-lg animate-pulse opacity-40">💨</div>
      </div>
    ),

    loading: (
      <div className={`${sizes[size]} mx-auto relative`}>
        {/* Loading Prayer Wheel */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-spin">
              ☸️
            </div>
            <div className="text-2xl text-gray-600 font-medium">
              Loading...
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Spinning the prayer wheel
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {illustrations[type] || illustrations['404']}
      
      {/* Cultural Quote */}
      <div className="mt-6 text-center max-w-md">
        <p className="text-sm text-gray-500 italic">
          "Every path in the mountains leads somewhere, but not every path leads where you want to go."
        </p>
        <p className="text-xs text-gray-400 mt-1">- Nepali Proverb</p>
      </div>
    </div>
  );
};

export default ErrorIllustration;
