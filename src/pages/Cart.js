import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GovernorateSelector from '../components/GovernorateSelector';
import PromoCodeInput from '../components/PromoCodeInput';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    selectedGovernorate,
    setSelectedGovernorate,
    getShippingCost,
    getTotalWithShipping,
    getShippingMessage,
    isShippingFree,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
    getDiscountAmount,
    getTotalAfterDiscount
  } = useCart();

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Your Cart</h1>
            <p className="text-xl text-gray-300 mb-8">No products in the cart</p>
            <Link
              to="/products"
              className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
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
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-dark-card rounded-lg shadow-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6 text-white">Selected Items</h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 mb-4">
                    {/* Mobile Layout */}
                    <div className="flex gap-4 mb-3">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-dark-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-300 text-sm mb-1">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-white font-semibold">{item.price} EGP</p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 bg-dark-secondary border border-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 bg-dark-secondary border border-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price and Remove */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <p className="font-semibold text-white text-lg">{(item.price * item.quantity)} EGP</p>
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
              
              {/* Governorate Selection */}
              <div className="mb-6">
                <GovernorateSelector 
                  selectedGovernorate={selectedGovernorate}
                  onGovernorateChange={setSelectedGovernorate}
                />
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                <PromoCodeInput
                  onCodeApplied={applyPromoCode}
                  orderTotal={getTotalPrice()}
                  appliedCode={appliedPromoCode}
                  onCodeRemoved={removePromoCode}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-white">
                  <span>Subtotal:</span>
                  <span>{getTotalPrice()} EGP</span>
                </div>
                {appliedPromoCode && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedPromoCode.discountPercentage}%):</span>
                    <span>-{getDiscountAmount()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-white">
                  <span>Delivery Fee:</span>
                  <span className={isShippingFree() ? 'text-green-600 font-semibold' : ''}>
                    {isShippingFree() ? 'Free!' : `${getShippingCost()} EGP`}
                  </span>
                </div>
                {getShippingMessage() && (
                  <div className={`text-sm p-2 rounded ${isShippingFree() ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {getShippingMessage()}
                  </div>
                )}
                {!isShippingFree() && getTotalAfterDiscount() < 3000 && (
                  <div className="text-sm p-2 rounded bg-yellow-100 text-yellow-800">
                    أضف {3000 - getTotalAfterDiscount()} جنيه أخرى للحصول على الشحن المجاني!
                  </div>
                )}
                <hr className="border-gray-300" />
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Total:</span>
                  <span>{getTotalWithShipping()} EGP</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className={`block w-full text-center py-3 px-6 rounded-lg transition-colors duration-300 font-semibold mt-6 ${
                  selectedGovernorate 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!selectedGovernorate) {
                    e.preventDefault();
                    alert('يرجى اختيار المحافظة أولاً');
                  }
                }}
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
