import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  // Load product by id
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        // Ensure safe defaults
        const normalized = {
          id: data.id,
          name: data.name,
          price: data.price,
          description: data.description || '',
          images: Array.isArray(data.images) ? data.images : [],
          category: data.category || null,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
          soldOut: !!data.soldOut,
        };
        if (isMounted) {
          setProduct(normalized);
          if (normalized.soldOut) {
            Swal.fire({
              icon: 'info',
              title: 'Sold Out',
              text: 'This product is currently sold out.',
              confirmButtonText: 'Back to Home'
            }).then(() => navigate('/'));
            return;
          }
        }
      } catch (e) {
        console.error('[ProductDetail] Failed to fetch product:', e);
        if (isMounted) setProduct(null);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  const handleAddToCart = () => {
    if (product?.soldOut) return;
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing selection',
        text: 'Please choose size and color',
        confirmButtonText: 'OK'
      });
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: 'Product has been added to your cart',
      confirmButtonText: 'OK'
    });
  };

  const handleBuyNow = () => {
    if (product?.soldOut) return;
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing selection',
        text: 'Please choose size and color',
        confirmButtonText: 'OK'
      });
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Card container to keep everything inside on mobile */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Images Section */}
            <div>
              {/* Main Image */}
              <div className="mb-4 bg-white border rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={(Array.isArray(product.images) && product.images.length > 0 ? product.images[mainImage] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K')}
                  alt={product.name}
                  className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {(product.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-white ${
                      mainImage === index ? 'border-dark' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className={`text-3xl font-bold break-words break-all ${product.soldOut ? 'text-gray-500 line-through' : 'text-dark'}`}>{product.name}</h1>
              <p className={`text-2xl font-bold ${product.soldOut ? 'text-gray-500' : 'text-red-600'}`}>{product.price} EGP</p>
              <p className="text-gray-600 leading-relaxed break-words break-all">{product.description}</p>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-dark">Choose Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || []).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'bg-dark text-white border-dark'
                          : 'bg-white text-dark border-gray-300 hover:border-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-dark">Choose Color:</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.colors || []).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'bg-dark text-white border-dark'
                          : 'bg-white text-dark border-gray-300 hover:border-dark'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-dark">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.soldOut ? (
                  <>
                    <button
                      type="button"
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
                    >
                      Sold Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-semibold"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-semibold"
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
