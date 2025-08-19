import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Barbari Store</h3>
            <p className="text-gray-300 mb-4">
              A modern fashion store offering the latest collections at competitive prices.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-300 hover:text-white transition-colors">
                  Cart
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/barbari.eg/?igsh=MTVteWZ2MHh3NzVqOA%3D%3D#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://wa.me/201272725988"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>
            <p className="text-gray-300 mt-4">
              WhatsApp: +20 127 272 5988
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            All rights reserved &copy; 2024 Barbari Store
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
