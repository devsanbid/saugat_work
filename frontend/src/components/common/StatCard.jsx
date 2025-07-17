import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, color = 'red' }) => {
  const colorClasses = {
    red: 'from-red-50 to-red-100',
    blue: 'from-blue-50 to-blue-100',
    green: 'from-green-50 to-green-100',
    purple: 'from-purple-50 to-purple-100',
    yellow: 'from-yellow-50 to-yellow-100',
    orange: 'from-orange-50 to-orange-100',
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              {trend > 0 ? (
                <TrendingUp className="text-green-500 mr-1" size={14} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={14} />
              )}
              <span className={`text-xs sm:text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 sm:p-4 bg-gradient-to-br ${colorClasses[color]} rounded-lg sm:rounded-xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
