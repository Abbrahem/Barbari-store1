import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase/config';
import { api } from '../../utils/api';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProduct = ({ editProduct = null, onDoneEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    sizes: [],
    colors: [],
    images: []
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Prefill when editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        price: editProduct.price != null ? String(editProduct.price) : '',
        description: editProduct.description || '',
        category: editProduct.category || '',
        sizes: Array.isArray(editProduct.sizes) ? editProduct.sizes : [],
        colors: Array.isArray(editProduct.colors) ? editProduct.colors : [],
        images: Array.isArray(editProduct.images) ? editProduct.images : []
      });
      setSelectedImages([]);
    }
  }, [editProduct]);

  const categoryOptions = {
    't-shirt': {
      colors: ['White', 'Black', 'Gray', 'Pink', 'Red', 'Blue', 'Baby Blue', 'Beige', 'Brown'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'pants': {
      colors: ['White', 'Black', 'Light Blue', 'Dark Blue', 'Teal', 'Dark Green', 'Brown', 'Gray'],
      sizes: ['30', '32', '34', '36', '38', '40']
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset sizes and colors when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        sizes: [],
        colors: []
      }));
    }
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You can upload up to 5 images only',
        confirmButtonText: 'OK'
      });
      return;
    }

    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || formData.sizes.length === 0 || formData.colors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing data',
        text: 'Please choose category, sizes and colors',
        confirmButtonText: 'OK'
      });
      return;
    }

    // In edit mode, images are optional. For create, require at least 1 image.
    if (!editProduct) {
      if (selectedImages.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing images',
          text: 'Please upload product images',
          confirmButtonText: 'OK'
        });
        return;
      }
    }

    try {
      if (!user) {
        Swal.fire({ icon: 'error', title: 'Not signed in', text: 'Please sign in to add products.' });
        return;
      }

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        active: true,
      };
      let res;
      if (editProduct && editProduct.id) {
        // Update product: send as FormData with images
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        selectedImages.forEach((file, index) => {
          formData.append('images', file);
        });
        res = await api.putForm(`/products/${editProduct.id}`, formData, { requireAuth: true });
      } else {
        // Create product: send images as FormData to backend (backend will handle base64 conversion)
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        selectedImages.forEach((file, index) => {
          formData.append('images', file);
        });
        res = await api.postForm('/products', formData, { requireAuth: true });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }

      await res.json();

      Swal.fire({
        icon: 'success',
        title: editProduct ? 'Updated' : 'Added',
        text: editProduct ? 'Product has been updated successfully' : 'Product has been added successfully',
        confirmButtonText: 'OK'
      });

      // After update, go back to manage products; after create, reset form
      if (editProduct) {
        if (onDoneEdit) onDoneEdit();
      } else {
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          sizes: [],
          colors: [],
          images: []
        });
        setSelectedImages([]);
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed', text: error.message || 'Failed to add product' });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      sizes: [],
      colors: [],
      images: []
    });
    setSelectedImages([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-dark">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-dark mb-2">
              Price (EGP)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
              placeholder="Enter price"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="t-shirt">T-Shirt</option>
              <option value="pants">Pants</option>
            </select>
          </div>

          {/* Sizes */}
          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Available Sizes
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categoryOptions[formData.category]?.sizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Available Colors
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categoryOptions[formData.category]?.colors.map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={() => handleColorChange(color)}
                      className="mr-2"
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Product Images (max 5)
            </label>
            {/* Hidden native input to allow multi-select; triggered by the button below */}
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="inline-flex items-center justify-center px-4 py-2 bg-dark text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
            >
              Upload Images
            </label>
            {editProduct ? (
              <p className="text-xs text-gray-500 mt-1">In edit mode, uploading images is optional. Existing images will remain if you don't upload new ones.</p>
            ) : null}
            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedImages.length} image(s) selected
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!authReady || !user}
              className="flex-1 bg-dark text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              {(!authReady || !user) ? 'Sign in required' : (editProduct ? 'Update Product' : 'Add New Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
