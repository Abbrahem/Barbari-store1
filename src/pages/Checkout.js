import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GovernorateSelector from '../components/GovernorateSelector';
import PromoCodeInput from '../components/PromoCodeInput';
import promoCodeService from '../services/promoCodeService';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { 
    items, 
    getTotalPrice, 
    clearCart, 
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
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone1: '',
    phone2: ''
  });

  const totalPrice = getTotalWithShipping();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate governorate is selected
    if (!selectedGovernorate) {
      Swal.fire({
        icon: 'error',
        title: 'يرجى اختيار المحافظة',
        text: 'يجب اختيار المحافظة لحساب رسوم التوصيل',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate phone numbers are different
    if (formData.phone1 === formData.phone2) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid input',
        text: 'Second phone number must be different from the first',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      // Normalize items for Firestore
      const normalizedItems = items.map((it) => ({
        productId: it.id || it.productId || it.product?.id || null,
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        size: it.size || null,
        color: it.color || null,
        image: it.image || null,
      }));

      const orderData = {
        items: normalizedItems,
        total: Number(totalPrice),
        subtotal: Number(getTotalPrice()),
        shippingCost: Number(getShippingCost()),
        governorate: selectedGovernorate,
        customer: {
          name: formData.fullName,
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2 || null,
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      // Add promo code info if applied
      if (appliedPromoCode) {
        orderData.promoCode = {
          code: appliedPromoCode.code,
          discountPercentage: appliedPromoCode.discountPercentage,
          discountAmount: getDiscountAmount(),
          originalTotal: getTotalPrice() + getShippingCost(),
          finalTotal: totalPrice
        };
      }

      // Save order directly to Firestore
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);

      // Update promo code usage count if applied
      if (appliedPromoCode) {
        try {
          await promoCodeService.applyPromoCode(appliedPromoCode.id);
        } catch (error) {
          console.error('Error updating promo code usage:', error);
          // Don't fail the order if promo code update fails
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        text: 'We will contact you soon to confirm your order',
        confirmButtonText: 'OK'
      }).then(() => {
        clearCart();
        window.location.href = '/';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Order failed',
        text: error.message || 'Could not place the order',
        confirmButtonText: 'OK'
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Checkout</h1>
            <p className="text-xl text-gray-300 mb-8">No products in the cart</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-dark-card rounded-lg shadow-lg p-4 sm:p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-700 pb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dark-secondary border border-gray-700 flex items-center justify-center">
                      <img
                        src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-sm text-gray-300">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="text-white font-semibold">{(item.price * item.quantity)} EGP</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                {/* Governorate Selection */}
                <div className="mb-4">
                  <GovernorateSelector 
                    selectedGovernorate={selectedGovernorate}
                    onGovernorateChange={setSelectedGovernorate}
                  />
                </div>

                {/* Promo Code Input */}
                <div className="mb-4">
                  <PromoCodeInput
                    onCodeApplied={applyPromoCode}
                    orderTotal={getTotalPrice()}
                    appliedCode={appliedPromoCode}
                    onCodeRemoved={removePromoCode}
                  />
                </div>
                
                <div className="space-y-2">
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
                    <span>{totalPrice} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <div className="bg-dark-card rounded-lg shadow-lg p-4 sm:p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6 text-white">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent resize-none text-white placeholder-gray-400"
                    placeholder="Enter your full address"
                  />
                </div>

                {/* Phone 1 */}
                <div>
                  <label htmlFor="phone1" className="block text-sm font-medium text-white mb-2">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    id="phone1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Phone 2 */}
                <div>
                  <label htmlFor="phone2" className="block text-sm font-medium text-white mb-2">
                    Secondary Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter another phone number"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
