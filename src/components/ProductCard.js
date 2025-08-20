import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback images handling
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
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

  const isSoldOut = !!product.soldOut;

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
          className={`w-full h-full object-contain bg-white transition-transform duration-700 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
        />
        {/* SOLD OUT Banner (prominent) */}
        {isSoldOut && (
          <div className="absolute top-0 left-0 right-0">
            <div className="w-full bg-red-600 text-white text-center py-2 text-sm font-extrabold tracking-wider shadow">SOLD OUT</div>
          </div>
        )}
        
        {/* Overlay with Quick Actions */}
        <div className={`absolute inset-0 ${isSoldOut ? 'bg-black/20 opacity-100' : 'bg-black/20'} transition-opacity duration-300 ${isHovered && !isSoldOut ? 'opacity-100' : ''}`}>
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className={`w-10 h-10 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 transform ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white hover:scale-110'}`}>
              <FaHeart className="text-gray-600 group-hover:text-red-500" />
            </button>
            <button className={`w-10 h-10 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 transform ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white hover:scale-110'}`}>
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
        <h3 className={`text-xl font-bold mb-3 text-gray-800 line-clamp-2 transition-colors duration-300 ${isSoldOut ? 'line-through text-gray-500' : 'group-hover:text-red-600'}`}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isSoldOut ? 'text-gray-500' : 'text-red-600'}`}>
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
        
        {isSoldOut ? (
          <button
            type="button"
            disabled
            className="block w-full bg-gray-400 text-white text-center py-3 rounded-xl cursor-not-allowed font-semibold shadow"
            aria-disabled="true"
          >
            Sold Out
          </button>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
