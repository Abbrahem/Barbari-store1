import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      // Force refresh to ensure latest custom claims
      await user.getIdToken(true);
      const tokenResult = await user.getIdTokenResult();
      const isAdmin = !!(tokenResult?.claims && tokenResult.claims.admin);
      if (!isAdmin) {
        await signOut(auth);
        return Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'This account is not an admin. Please contact support.',
        });
      }
      navigate('/admin/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.message || 'Invalid email or password',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-dark-card rounded-lg shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Barbari Store</h1>
            <p className="text-gray-300">Admin Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Use your Firebase admin account to sign in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
