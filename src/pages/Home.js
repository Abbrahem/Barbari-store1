import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductSlider from '../components/ProductSlider';
import Categories from '../components/Categories';
import FeaturedProduct from '../components/FeaturedProduct';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);

  // Load products from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        const normalized = (data.items || []).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          thumbnail: p.thumbnail || null,
          images: [], // list endpoint omits images; components will fallback
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          colors: Array.isArray(p.colors) ? p.colors : [],
        }));
        if (isMounted) {
          setProducts(normalized);
          setFeaturedProduct(normalized[0] || null);
        }
      } catch (e) {
        console.error('[Home] Failed to fetch products:', e);
        if (isMounted) {
          setProducts([]);
          setFeaturedProduct(null);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductSlider products={products} />
      <Categories />
      <FeaturedProduct product={featuredProduct} />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;
