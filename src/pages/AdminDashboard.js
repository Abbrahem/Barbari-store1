import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import ManageOrders from '../components/admin/ManageOrders';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, authReady } = useAuth();
  const [activeTab, setActiveTab] = useState('add-product');
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    // Wait for auth to init
    if (!authReady) return;
    if (!user) {
      navigate('/admin');
      return;
    }
    // Optional: verify claim quickly; AddProduct/ManageProducts/ManageOrders will also enforce via token
    (async () => {
      try {
        const res = await user.getIdTokenResult();
        if (!res?.claims?.admin) {
          navigate('/admin');
        }
      } catch {
        navigate('/admin');
      }
    })();
  }, [navigate, user, authReady]);

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    navigate('/admin');
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setActiveTab('add-product');
  };

  const handleDoneEdit = () => {
    setEditProduct(null);
    setActiveTab('manage-products');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add-product':
        return <AddProduct editProduct={editProduct} onDoneEdit={handleDoneEdit} />;
      case 'manage-products':
        return <ManageProducts onEdit={handleEditProduct} />;
      case 'orders':
        return <ManageOrders />;
      default:
        return <AddProduct editProduct={editProduct} onDoneEdit={handleDoneEdit} />;
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-dark text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Barbari Store - Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          {/* Responsive tabs without horizontal scroll */}
          <div className="px-0">
            <div className="flex flex-wrap gap-2 sm:gap-6">
              <button
                onClick={() => setActiveTab('manage-products')}
                className={`flex-1 basis-1/2 sm:basis-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'manage-products'
                    ? 'text-dark border-dark'
                    : 'text-gray-600 border-transparent hover:text-dark'
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 basis-1/2 sm:basis-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'orders'
                    ? 'text-dark border-dark'
                    : 'text-gray-600 border-transparent hover:text-dark'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('add-product')}
                className={`w-full sm:w-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'add-product'
                    ? 'text-dark border-dark'
                    : 'text-gray-600 border-transparent hover:text-dark'
                }`}
              >
                Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
