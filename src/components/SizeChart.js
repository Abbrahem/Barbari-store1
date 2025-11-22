import React, { useState } from 'react';

const SizeChart = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSizeChartImage = (category) => {
    // You can add different size chart images for different categories
    switch (category) {
      case 't-shirt':
        return '/size-chart-tshirt.jpg';
      case 'hoodies':
        return '/size-chart-hoodies.jpg';
      case 'zip-up':
        return '/size-chart-zipup.jpg';
      case 'crow-nek':
        return '/size-chart-crownek.jpg';
      default:
        return '/size-chart-default.jpg';
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dark-secondary border border-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold flex items-center justify-between"
      >
        <span>Size Chart</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-dark-card border border-gray-700 rounded-lg">
          <img
            src={getSizeChartImage(category)}
            alt="Size Chart"
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjYyNjI2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPlNpemUgQ2hhcnQ8L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
          <p className="text-gray-300 text-sm mt-2 text-center">
            Please refer to this size chart before placing your order
          </p>
        </div>
      )}
    </div>
  );
};

export default SizeChart;