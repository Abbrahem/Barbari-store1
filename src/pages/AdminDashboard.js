import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/admin/AddProduct';
import ManageProducts from '../components/admin/ManageProducts';
import ManageOrders from '../components/admin/ManageOrders';
import PromoCodeManager from '../components/admin/PromoCodeManager';
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
      case 'promo-codes':
        return <PromoCodeManager />;
      default:
        return <AddProduct editProduct={editProduct} onDoneEdit={handleDoneEdit} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-secondary text-white p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Barbari Store - Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-dark-card shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4">
          {/* Responsive tabs without horizontal scroll */}
          <div className="px-0">
            <div className="flex flex-wrap gap-2 sm:gap-6">
              <button
                onClick={() => setActiveTab('manage-products')}
                className={`flex-1 basis-1/2 sm:basis-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'manage-products'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 basis-1/2 sm:basis-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'orders'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('add-product')}
                className={`flex-1 basis-1/2 sm:basis-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'add-product'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Add New Product
              </button>
              <button
                onClick={() => setActiveTab('promo-codes')}
                className={`w-full sm:w-auto py-3 px-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  activeTab === 'promo-codes'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Promo Codes
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
