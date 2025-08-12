import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 't-shirt',
      name: 'T-Shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'A wide variety of stylish t-shirts'
    },
    {
      id: 'pants',
      name: 'Pants',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Trendy and comfortable pants'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Comfortable and elegant shoes'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 text-dark">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
