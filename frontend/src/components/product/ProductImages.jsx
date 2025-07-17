import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';

const ProductImages = ({ images = [], productName = '', className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imageError, setImageError] = useState({});

  const defaultImages = [
    { url: '/api/placeholder/400/400', alt: 'Product image' }
  ];

  const productImages = images.length > 0 ? images : defaultImages;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomOpen(!isZoomOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setIsZoomOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {!imageError[currentImageIndex] ? (
          <img
            src={productImages[currentImageIndex]?.url}
            alt={productImages[currentImageIndex]?.alt || productName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => handleImageError(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50">
            <span className="text-8xl opacity-50">🎨</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={handleZoomToggle}
          className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Zoom image"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* Image Counter */}
        {productImages.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            {currentImageIndex + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 hover:border-red-500 ${
                index === currentImageIndex
                  ? 'border-red-500 ring-2 ring-red-200'
                  : 'border-gray-200'
              }`}
            >
              {!imageError[index] ? (
                <img
                  src={image.url}
                  alt={image.alt || `${productName} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-2xl opacity-50">🎨</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        size="4xl"
        showCloseButton={true}
      >
        <div className="relative">
          <img
            src={productImages[currentImageIndex]?.url}
            alt={productImages[currentImageIndex]?.alt || productName}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                onClick={prevImage}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductImages;
