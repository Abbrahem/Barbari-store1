import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load products from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        // Normalize items; preserve images and derive thumbnail if missing
        const normalized = (data.items || []).map(p => {
          const images = Array.isArray(p.images) ? p.images : [];
          const thumbnail = p.thumbnail || (images.length > 0 ? images[0] : null);
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            thumbnail,
            images,
            soldOut: !!p.soldOut,
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            colors: Array.isArray(p.colors) ? p.colors : [],
          };
        });
        if (isMounted) setProducts(normalized);
      } catch (e) {
        console.error('[Products] Failed to fetch products:', e);
        if (isMounted) setProducts([]);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Get category from URL params (allow only t-shirt and pants)
  useEffect(() => {
    const category = searchParams.get('category');
    const allowed = new Set(['t-shirt', 'pants']);
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
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-dark">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-dark text-white'
                  : 'bg-gray-200 text-dark hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange('t-shirt')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 't-shirt'
                  ? 'bg-dark text-white'
                  : 'bg-gray-200 text-dark hover:bg-gray-300'
              }`}
            >
              T-Shirt
            </button>
            <button
              onClick={() => handleCategoryChange('pants')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'pants'
                  ? 'bg-dark text-white'
                  : 'bg-gray-200 text-dark hover:bg-gray-300'
              }`}
            >
              Pants
            </button>
            {/* Shoes category removed */}
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
            <p className="text-xl text-gray-600 mb-4">
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
