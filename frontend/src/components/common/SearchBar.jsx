import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const popularSearches = [
    'Sarangi', 'Khukuri', 'Dhaka Topi', 'Thanka', 'Gundruk',
    'Honey', 'Madal', 'Doko', 'Daura Suruwal', 'Singing Bowl'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(popularSearches.slice(0, 5));
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for authentic Nepali products..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-full focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 text-gray-700"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Search Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 z-50 max-h-96 overflow-y-auto animate-fadeIn">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {searchTerm ? 'Suggestions' : 'Popular Searches'}
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
