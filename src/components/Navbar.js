import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/barbary.jpg';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const slides = [
    "Explore Barbari Store Products",
    "Get 15% Discount on All Items",
    "Free Shipping Over 4500 EGP"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      {/* Top Slider (gradient background) */}
      <div className="bg-dark text-white py-3 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="transition-all duration-700 ease-in-out transform">
                {slides[currentSlide]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3 relative">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={logoImg} alt="Barbari logo" className="h-10 w-10 mr-2 object-cover rounded-full" />
                <span className="hidden md:inline text-2xl md:text-3xl font-bold text-dark hover:text-gray-800 transition-colors duration-300">بربري</span>
              </Link>
            </div>

            {/* Mobile centered brand */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 transform">
              <span className="text-2xl sm:text-3xl font-bold text-dark">بربري</span>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium">
                Categories
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium">
                Contact
              </Link>
            </div>

            {/* Cart Icon and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative group">
                <FaShoppingCart className="text-2xl text-gray-700 group-hover:text-red-600 transition-colors duration-300" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 hover:text-red-600 transition-colors duration-300"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/categories" 
                  className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
