import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const deliveryFee = 120;

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-dark">Your Cart</h1>
            <p className="text-xl text-gray-600 mb-8">No products in the cart</p>
            <Link
              to="/products"
              className="bg-dark text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-dark">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-dark">Selected Items</h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-red-600 font-semibold">{item.price} EGP</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div>
                      <p className="font-semibold text-dark">{(item.price * item.quantity)} EGP</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-dark">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getTotalPrice()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee} EGP</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{getTotalPrice() + deliveryFee} EGP</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-dark text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold mt-6"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
