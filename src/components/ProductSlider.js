import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSlider = ({ products }) => {
  return (
    <section className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Latest Products
        </h2>
        
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="product-swiper"
        >
          {products.map((product) => {
            const placeholder = 'https://via.placeholder.com/600x400?text=No+Image';
            const firstImage = (Array.isArray(product.images) && product.images.length > 0)
              ? product.images[0]
              : (product.thumbnail || placeholder);
            const isSoldOut = !!product.soldOut;
            return (
              <SwiperSlide key={product.id}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden bg-white">
                    <img
                      src={firstImage}
                      alt={product.name}
                      className={`w-full h-full object-contain ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
                    />
                    {isSoldOut && (
                      <div className="absolute top-0 left-0 right-0">
                        <div className="w-full bg-red-600 text-white text-center py-1.5 text-xs font-extrabold tracking-wider shadow">SOLD OUT</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold mb-2 ${isSoldOut ? 'text-gray-500 line-through' : 'text-dark'}`}>
                      {product.name}
                    </h3>
                    <p className={`mb-3 ${isSoldOut ? 'text-gray-500' : 'text-gray-600'}`}>
                      {product.price} EGP
                    </p>
                    {isSoldOut ? (
                      <button
                        type="button"
                        disabled
                        className="block w-full bg-gray-400 text-white text-center py-2 rounded-lg cursor-not-allowed"
                        aria-disabled="true"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <Link
                        to={`/product/${product.id}`}
                        className="block w-full bg-dark text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                      >
                        View Product
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSlider;
