import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ currentProductId, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', category),
          where('active', '!=', false),
          limit(6) // Get 6 products to filter out current one
        );
        const snapshot = await getDocs(q);

        const products = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            images: Array.isArray(doc.data().images) ? doc.data().images : [],
            thumbnail: doc.data().thumbnail || (Array.isArray(doc.data().images) && doc.data().images[0]) || null
          }))
          .filter(product => product.id !== currentProductId) // Exclude current product
          .slice(0, 4); // Take only 4 products

        setRelatedProducts(products);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category && currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">Loading related products...</div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Other Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjYyNjI2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
          const firstImage = (product.images && product.images.length > 0)
            ? product.images[0]
            : (product.thumbnail || placeholder);
          const isSoldOut = !!product.soldOut;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group block"
            >
              <div className="bg-dark-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-800">
                <div className="relative h-48 overflow-hidden bg-dark-secondary">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className={`w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
                  />
                  {isSoldOut && (
                    <div className="absolute top-0 left-0 right-0">
                      <div className="w-full bg-red-600 text-white text-center py-1 text-xs font-bold">SOLD OUT</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 text-white line-clamp-2 ${isSoldOut ? 'line-through text-gray-500' : 'group-hover:text-gray-300'}`}>
                    {product.name}
                  </h3>
                  <p className={`text-xl font-bold ${isSoldOut ? 'text-gray-500' : 'text-white'}`}>
                    {product.price} EGP
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;