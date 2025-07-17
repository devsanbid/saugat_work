import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'md',
  closeOnBackdrop = true,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full'
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-2xl w-full 
          ${sizes[size]} 
          max-h-[90vh] overflow-y-auto
          transform transition-all duration-300
          animate-scaleIn
          ${className}
        `}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}) => {
  const typeConfig = {
    warning: {
      icon: "⚠️",
      confirmVariant: "warning",
      color: "text-yellow-600"
    },
    danger: {
      icon: "🚨",
      confirmVariant: "danger",
      color: "text-red-600"
    },
    success: {
      icon: "✅",
      confirmVariant: "success",
      color: "text-green-600"
    }
  };

  const config = typeConfig[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <div className="text-center space-y-4">
        <div className="text-6xl">{config.icon}</div>
        <p className={`text-lg ${config.color} font-medium`}>{message}</p>
        
        <div className="flex space-x-3 justify-center mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
