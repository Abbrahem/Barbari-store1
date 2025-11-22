import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockProducts } from '../data/mockProducts';

import Categories from '../components/Categories';
import FeaturedProduct from '../components/FeaturedProduct';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);

  // Load products from Firestore
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('active', '!=', false));
        const snapshot = await getDocs(q);
        const normalized = snapshot.docs.map(doc => {
          const p = doc.data();
          const images = Array.isArray(p.images) ? p.images : [];
          const thumbnail = p.thumbnail || (images.length > 0 ? images[0] : null);
          return {
            id: doc.id,
            name: p.name,
            price: p.price,
            category: p.category || null,
            thumbnail,
            images,
            soldOut: !!p.soldOut,
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            colors: Array.isArray(p.colors) ? p.colors : [],
          };
        });
        if (isMounted) {
          setProducts(normalized);
          setFeaturedProduct(normalized[0] || null);
        }
      } catch (e) {
        console.error('[Home] Failed to fetch products:', e);
        if (isMounted) {
          setProducts(mockProducts);
          setFeaturedProduct(mockProducts[0] || null);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <HeroSection />
      <Categories />
      <FeaturedProduct product={featuredProduct} />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;
