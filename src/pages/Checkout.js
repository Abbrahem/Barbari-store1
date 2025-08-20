import React, { useState } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone1: '',
    phone2: ''
  });

  const deliveryFee = 120;
  const totalPrice = getTotalPrice() + deliveryFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // Normalize items for backend
      const normalizedItems = items.map((it) => ({
        productId: it.id || it.productId || it.product?.id || null,
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        size: it.size || null,
        color: it.color || null,
        image: it.image || null,
      }));

      const payload = {
        items: normalizedItems,
        total: Number(totalPrice),
        customer: {
          name: formData.fullName,
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2 || null,
        },
      };

      const res = await api.post('/orders', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to place order');
      }

      await res.json().catch(() => null);

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
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-dark">Checkout</h1>
            <p className="text-xl text-gray-600 mb-8">No products in the cart</p>
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
        <h1 className="text-3xl font-bold mb-8 text-dark">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-dark">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border flex items-center justify-center">
                      <img
                        src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="text-red-600 font-semibold">{(item.price * item.quantity)} EGP</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
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
                  <span>{totalPrice} EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-dark">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-dark mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-dark mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent resize-none"
                    placeholder="Enter your full address"
                  />
                </div>

                {/* Phone 1 */}
                <div>
                  <label htmlFor="phone1" className="block text-sm font-medium text-dark mb-2">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    id="phone1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Phone 2 */}
                <div>
                  <label htmlFor="phone2" className="block text-sm font-medium text-dark mb-2">
                    Secondary Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
                    placeholder="Enter another phone number"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-dark text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
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
