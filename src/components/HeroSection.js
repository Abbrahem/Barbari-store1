import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero.jpg';

const HeroSection = () => {
  return (
    <section 
      className="h-[90vh] relative bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`
      }}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 animate-pulse"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-red-500/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-10 w-12 h-12 bg-red-600/30 rounded-full animate-ping"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent animate-pulse">
            Shevoo Store
          </h1>
          <p className="text-xl md:text-3xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay">
            Discover the Latest Collection of Modern and Elegant Fashion
          </p>
          <div className="flex justify-center items-center animate-fade-in-up-delay-2">
            <Link 
              to="/products"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 text-lg font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
