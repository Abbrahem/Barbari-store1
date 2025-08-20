import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProduct = ({ product }) => {
  if (!product) return null;
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  const firstImage = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images[0]
    : (product.thumbnail || placeholder);
  const isSoldOut = !!product.soldOut;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Featured Product
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Product Image */}
              <div className="relative h-96 lg:h-full">
                <img
                  src={firstImage}
                  alt={product.name}
                  className={`w-full h-full object-cover ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
                />
                {isSoldOut && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="w-full bg-red-600 text-white text-center py-2 text-sm font-extrabold tracking-wider shadow">SOLD OUT</div>
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="p-8 flex flex-col justify-center">
                <h3 className={`text-3xl font-bold mb-4 ${isSoldOut ? 'text-gray-500 line-through' : 'text-dark'}`}>
                  {product.name}
                </h3>
                <p className={`text-2xl font-semibold mb-4 ${isSoldOut ? 'text-gray-500' : 'text-red-600'}`}>
                  {product.price} EGP
                </p>
                {product.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                )}
                
                <div className="space-y-4">
                  {product.sizes?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-dark">Available Sizes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 bg-gray-100 text-dark rounded-full text-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {product.colors?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-dark">Available Colors:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <span
                            key={color}
                            className="px-3 py-1 bg-gray-100 text-dark rounded-full text-sm"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {isSoldOut ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 bg-gray-400 text-white text-center py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
                    aria-disabled="true"
                  >
                    Sold Out
                  </button>
                ) : (
                  <Link
                    to={`/product/${product.id}`}
                    className="mt-6 bg-dark text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
                  >
                    View Product
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
