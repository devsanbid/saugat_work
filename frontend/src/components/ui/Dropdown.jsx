import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  multiple = false,
  searchable = false,
  className = '',
  size = 'md',
  variant = 'default',
  label,
  error,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'border-gray-300 focus:border-red-500 focus:ring-red-200',
    nepal: 'border-red-300 focus:border-red-600 focus:ring-red-100',
    outline: 'border-2 border-gray-300 focus:border-red-500 focus:ring-red-200'
  };

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);
  const selectedOptions = multiple
    ? options.filter(option => value?.includes(option.value))
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    if (multiple) {
      const newValue = value?.includes(option.value)
        ? value.filter(v => v !== option.value)
        : [...(value || []), option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    if (multiple) {
      return selectedOptions.length > 0
        ? `${selectedOptions.length} selected`
        : placeholder;
    }
    return selectedOption?.label || placeholder;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between rounded-lg border transition-all duration-300
            focus:outline-none focus:ring-2 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variants[variant]}
            ${sizes[size]}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        >
          <span className={`truncate ${!selectedOption && !multiple ? 'text-gray-500' : ''}`}>
            {getDisplayValue()}
          </span>
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-slideDown">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? value?.includes(option.value)
                    : value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className={`
                        w-full px-4 py-2 text-left text-sm transition-colors duration-200
                        flex items-center justify-between
                        ${isSelected
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && <CheckIcon className="h-4 w-4 text-red-600" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Category Dropdown Component
export const CategoryDropdown = ({ value, onChange, className = '' }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'musical-instruments', label: 'Musical Instruments' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'tools-crafts', label: 'Tools & Crafts' },
    { value: 'clothing', label: 'Clothing' }
  ];

  return (
    <Dropdown
      options={categories}
      value={value}
      onChange={onChange}
      placeholder="Select category"
      variant="nepal"
      className={className}
    />
  );
};

// Sort Dropdown Component
export const SortDropdown = ({ value, onChange, className = '' }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Sort by Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <Dropdown
      options={sortOptions}
      value={value}
      onChange={onChange}
      placeholder="Sort by"
      size="sm"
      className={className}
    />
  );
};

export default Dropdown;
