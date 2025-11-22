import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroBg from '../assets/b41.jpg';

const HeroSection = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/products');
    }, 800);
  };

  return (
    <section 
      className="h-[85vh] md:h-[90vh] relative flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src={heroBg}
        srcSet={`${heroBg} 1x, ${heroBg} 2x`}
        sizes="100vw"
        alt="Barbari Store Hero"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        decoding="async"
        loading="eager"
      />
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white tracking-wide">
            Barbari Store
          </h1>
          <p className="text-lg md:text-xl mb-12 text-gray-200 font-light">
            Premium Fashion • Modern Style • Quality First
          </p>
          
          <div className="flex justify-center items-center">
            <button
              onClick={handleButtonClick}
              className="water-button relative overflow-hidden bg-transparent border-2 border-white/80 text-white px-12 py-4 text-lg font-semibold rounded-full backdrop-blur-sm hover:border-white transition-all duration-300 group"
              disabled={isClicked}
            >
              {/* Water effect elements */}
              <div className={`water-left absolute top-0 left-0 h-full bg-white/20 transition-all duration-700 ${isClicked ? 'w-1/2' : 'w-0'}`}></div>
              <div className={`water-right absolute top-0 right-0 h-full bg-white/20 transition-all duration-700 ${isClicked ? 'w-1/2' : 'w-0'}`}></div>
              
              {/* Button text */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Shop Now
              </span>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>


    </section>
  );
};

export default HeroSection;
