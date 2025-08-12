import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProduct = ({ product }) => {
  if (!product) return null;
  const placeholder = 'https://via.placeholder.com/800x600?text=No+Image';
  const firstImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : placeholder;

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
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4 text-dark">
                  {product.name}
                </h3>
                <p className="text-2xl font-semibold text-red-600 mb-4">
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
                
                <Link
                  to={`/product/${product.id}`}
                  className="mt-6 bg-dark text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
