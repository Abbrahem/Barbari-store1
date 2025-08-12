import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback images handling
  const placeholder = 'https://via.placeholder.com/600x400?text=No+Image';
  const rawImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const images = rawImages.length > 0
    ? rawImages
    : (product.thumbnail ? [product.thumbnail] : [placeholder]);

  // Auto-slide images every 8 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [images.length]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain bg-white transition-transform duration-700"
        />
        
        {/* Overlay with Quick Actions */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110">
              <FaHeart className="text-gray-600 group-hover:text-red-500" />
            </button>
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110">
              <FaShoppingCart className="text-gray-600 group-hover:text-red-500" />
            </button>
          </div>
        </div>
        
        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">
              {product.price} EGP
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {product.originalPrice} EGP
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <Link
          to={`/product/${product.id}`}
          className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
