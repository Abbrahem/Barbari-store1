import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero.jpg';

const HeroSection = () => {
  return (
    <section 
      className="h-[85vh] md:h-[90vh] relative flex items-end justify-center pb-24 md:pb-32 overflow-hidden"
    >
      {/* Background image as <img> for better quality handling */}
      <img
        src={heroBg}
        srcSet={`${heroBg} 1x, ${heroBg} 2x`}
        sizes="100vw"
        alt="Barbari Store Hero"
        className="absolute inset-0 w-full h-full object-cover object-top md:object-center select-none pointer-events-none"
        decoding="async"
        loading="eager"
      />
      {/* Background Overlay (static) */}
      <div className="absolute inset-0 bg-black/10 sm:bg-black/20 md:bg-black/40"></div>
      
      {/* Content (no animations) */}
      <div className="relative z-10 text-center text-white px-4">
        <div>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 text-white">
            Barbari Store
          </h1>
          <p className="text-xl md:text-3xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the Latest Collection of Modern and Elegant Fashion
          </p>
          <div className="flex justify-center items-center">
            <Link 
              to="/products"
              className="bg-dark text-white px-10 py-4 text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (static) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
