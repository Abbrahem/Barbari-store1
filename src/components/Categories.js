import { Link } from 'react-router-dom';
import barbritshirt from '../assets/barbritshirt.jpg';
import zipupImg from '../assets/zipup.jpg';
import crownekImg from '../assets/crownek.jpg';
const hoddieImg = '/hoddie.jpg';

const Categories = () => {
  const categories = [
    {
      id: 't-shirt',
      name: 'T-Shirts',
      image: barbritshirt,
      description: 'Premium quality t-shirts'
    },
    {
      id: 'hoodies',
      name: 'Hoodies',
      image: hoddieImg,
      description: 'Comfortable and stylish hoodies'
    },
    {
      id: 'zip-up',
      name: 'Zip-Up',
      image: zipupImg,
      description: 'Modern zip-up hoodies and jackets'
    },
    {
      id: 'crow-nek',
      name: 'Crow Nek',
      image: crownekImg,
      description: 'Classic crew neck sweatshirts'
    }
  ];

  return (
    <section className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group block"
            >
              <div className="bg-dark-card rounded-xl shadow-2xl overflow-hidden hover:shadow-white/10 transition-all duration-500 transform hover:-translate-y-3 border border-gray-800 hover:border-gray-600">
                <div className="relative h-72 overflow-hidden bg-dark-secondary">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
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
