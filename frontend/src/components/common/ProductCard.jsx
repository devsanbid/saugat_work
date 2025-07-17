import React from 'react';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
      <p className="text-lg font-bold text-gray-900 mb-2">Rs{product.price}</p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{product.stock} in stock</span>
        <div className="flex items-center space-x-1">
          <Star className="text-yellow-400 fill-current" size={14} />
          <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
          <Eye size={16} />
          <span className="text-sm">View</span>
        </button>
        <button 
          onClick={() => onEdit(product)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors"
        >
          <Edit size={16} />
          <span className="text-sm">Edit</span>
        </button>
        <button 
          onClick={() => onDelete(product.id)}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
        >
          <Trash2 size={16} />
          <span className="text-sm">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
