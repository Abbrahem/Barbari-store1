import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import SplashScreen from './components/SplashScreen';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ManageOrders from './components/admin/ManageOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
