import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Mock data
  useEffect(() => {
    const mockOrders = [
      {
        id: '1',
        customerName: 'Ahmed Mohamed',
        phone1: '01012345678',
        phone2: '01123456789',
        address: 'Nile Street, Cairo',
        items: [
          {
            name: 'Classic T-Shirt',
            size: 'L',
            color: 'White',
            quantity: 2,
            price: 150,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          }
        ],
        totalPrice: 420,
        status: 'pending',
        orderDate: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        customerName: 'Fatma Ali',
        phone1: '01234567890',
        phone2: '',
        address: 'Tahrir Street, Alexandria',
        items: [
          {
            name: 'Denim Jeans',
            size: '32',
            color: 'Blue',
            quantity: 1,
            price: 250,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          }
        ],
        totalPrice: 370,
        status: 'processing',
        orderDate: '2024-01-14T15:45:00Z'
      }
    ];

    setOrders(mockOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Order status updated successfully',
      confirmButtonText: 'OK'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusName = (status) => {
    const names = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return names[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-dark">Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No orders available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-dark">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-dark mb-2">Customer Info</h4>
                    <p className="text-sm text-gray-600">Name: {order.customerName}</p>
                    <p className="text-sm text-gray-600">Phone 1: {order.phone1}</p>
                    {order.phone2 && (
                      <p className="text-sm text-gray-600">Phone 2: {order.phone2}</p>
                    )}
                    <p className="text-sm text-gray-600">Address: {order.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-2">Order Details</h4>
                    <p className="text-sm text-gray-600">Subtotal: {order.totalPrice - 120} EGP</p>
                    <p className="text-sm text-gray-600">Delivery Fee: 120 EGP</p>
                    <p className="text-sm font-semibold text-dark">Total: {order.totalPrice} EGP</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-dark mb-3">Ordered Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-dark">{item.name}</h5>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-red-600">
                            {item.price * item.quantity} EGP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
