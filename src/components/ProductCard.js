import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartProvider';
import { sortSizes } from '../utils/sizeUtils';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  const handleQuickOrder = () => {
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing selection',
        text: 'Please choose size and color',
        confirmButtonText: 'OK'
      });
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing selection',
        text: 'Please choose size and color',
        confirmButtonText: 'OK'
      });
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: 'Product has been added to your cart',
      confirmButtonText: 'OK'
    });
    setShowQuickOrder(false);
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-dark-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-800">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className={`w-full h-full object-contain bg-dark-secondary transition-transform duration-700 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
        />
        {/* SOLD OUT Banner (prominent) */}
        {isSoldOut && (
          <div className="absolute top-0 left-0 right-0">
            <div className="w-full bg-red-600 text-white text-center py-2 text-sm font-extrabold tracking-wider shadow">SOLD OUT</div>
          </div>
        )}
        
        {/* Quick Action Button - Always Visible */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setShowQuickOrder(!showQuickOrder)}
            className={`w-10 h-10 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-lg ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'}`}
            disabled={isSoldOut}
          >
            <FaShoppingCart className="text-gray-600" />
          </button>
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
        <h3 className={`text-xl font-bold mb-3 text-white line-clamp-2 transition-colors duration-300 ${isSoldOut ? 'line-through text-gray-500' : 'group-hover:text-gray-300'}`}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isSoldOut ? 'text-gray-500' : 'text-white'}`}>
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
            <span className="text-sm text-gray-300">4.8</span>
          </div>
        </div>
        
        {isSoldOut ? (
          <button
            type="button"
            disabled
            className="block w-full bg-gray-600 text-gray-400 text-center py-3 rounded-xl cursor-not-allowed font-semibold shadow"
            aria-disabled="true"
          >
            Sold Out
          </button>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="block w-full bg-white text-black text-center py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Details
          </Link>
        )}
      </div>
      </div>

      {/* Quick Order Bottom Sheet Modal */}
      {showQuickOrder && !isSoldOut && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowQuickOrder(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-gray-700 rounded-t-3xl shadow-2xl z-50 animate-slide-up max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
              
              {/* Product Info Header */}
              <div className="flex items-start space-x-4 mb-6 pb-4 border-b border-gray-700">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-dark-secondary">
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-lg truncate">{product.name}</h4>
                <p className="text-white font-bold text-xl">{product.price} EGP</p>
              </div>
            </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-white mb-3 text-base">Size:</h5>
                  <div className="flex flex-wrap gap-2">
                    {sortSizes(product.sizes || []).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-dark-secondary text-white border-gray-700 hover:border-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-3 text-base">Color:</h5>
                  <div className="flex flex-wrap gap-2">
                    {(product.colors || []).map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          selectedColor === color
                            ? 'bg-white text-black border-white'
                            : 'bg-dark-secondary text-white border-gray-700 hover:border-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-3 text-base">Quantity:</h5>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-dark-secondary border border-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-dark-secondary border border-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-[0.7] bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors text-lg font-bold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setShowQuickOrder(false)}
                    className="flex-[0.3] bg-dark-secondary border border-gray-700 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-colors text-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
