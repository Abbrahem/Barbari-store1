import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load products from Firestore
  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('active', '!=', false)); // Only fetch active products
        const querySnapshot = await getDocs(q);
        
        if (isMounted) {
          const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure arrays are properly initialized
            images: Array.isArray(doc.data().images) ? doc.data().images : [],
            sizes: Array.isArray(doc.data().sizes) ? doc.data().sizes : [],
            colors: Array.isArray(doc.data().colors) ? doc.data().colors : [],
            // Ensure thumbnail exists or use first image
            thumbnail: doc.data().thumbnail || (Array.isArray(doc.data().images) && doc.data().images[0]) || null
          }));
          
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) setProducts([]);
      }
    };
    
    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Get category from URL params (allow only t-shirt, hoodies, zip-up, crow-nek)
  useEffect(() => {
    const category = searchParams.get('category');
    const allowed = new Set(['t-shirt', 'hoodies', 'zip-up', 'crow-nek']);
    if (category && allowed.has(category)) {
      setSelectedCategory(category);
    } else if (category && !allowed.has(category)) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Products
        </h1>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white text-black'
                  : 'bg-dark-card text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange('t-shirt')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 't-shirt'
                  ? 'bg-white text-black'
                  : 'bg-dark-card text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => handleCategoryChange('hoodies')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'hoodies'
                  ? 'bg-white text-black'
                  : 'bg-dark-card text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Hoodies
            </button>
            <button
              onClick={() => handleCategoryChange('zip-up')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'zip-up'
                  ? 'bg-white text-black'
                  : 'bg-dark-card text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Zip-Up
            </button>
            <button
              onClick={() => handleCategoryChange('crow-nek')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'crow-nek'
                  ? 'bg-white text-black'
                  : 'bg-dark-card text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Crow Nek
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />)
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300 mb-4">
              No products available
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
