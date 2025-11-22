import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth, db } from '../../firebase/config';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // نفس المقاسات والألوان لكل الكاتيجوريز (مثل t-shirts)
  const standardOptions = {
    colors: ['White', 'Black', 'Gray', 'Pink', 'Red', 'Blue', 'Baby Blue', 'Beige', 'Brown'],
    sizes: ['S', 'M', 'L', 'XS', 'XL', 'XXL']
  };

  const categoryOptions = {
    't-shirt': standardOptions,
    'hoodies': standardOptions,
    'zip-up': standardOptions,
    'crow-nek': standardOptions
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

    setIsSubmitting(true);

    // Show loading message
    Swal.fire({
      title: editProduct ? 'Updating Product...' : 'Adding Product...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      if (!user) {
        Swal.fire({ icon: 'error', title: 'Not signed in', text: 'Please sign in to add products.' });
        setIsSubmitting(false);
        return;
      }

      // Convert selected images to base64 Data URLs with compression
      const fileToDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Compress image if it's too large
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set max dimensions
            const maxWidth = 800;
            const maxHeight = 600;
            let { width, height } = img;
            
            // Calculate new dimensions
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedDataUrl);
          };
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      let uploadedDataUrls = [];
      if (selectedImages.length > 0) {
        // Process images one by one to show progress
        for (let i = 0; i < selectedImages.length; i++) {
          Swal.update({
            title: `Processing image ${i + 1} of ${selectedImages.length}...`,
            text: 'Please wait while we optimize your images'
          });
          const dataUrl = await fileToDataUrl(selectedImages[i]);
          uploadedDataUrls.push(dataUrl);
        }
      }

      if (editProduct && editProduct.id) {
        // Update existing product
        const nextImages = uploadedDataUrls.length > 0 ? [...(formData.images || []), ...uploadedDataUrls] : (formData.images || []);
        const updatePayload = {
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
          sizes: formData.sizes,
          colors: formData.colors,
          images: nextImages,
          thumbnail: nextImages[0] || editProduct.thumbnail || null,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(doc(db, 'products', editProduct.id), updatePayload);
      } else {
        // Create new product
        const images = uploadedDataUrls;
        const createPayload = {
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
          sizes: formData.sizes,
          colors: formData.colors,
          images,
          thumbnail: images[0] || null,
          soldOut: false,
          active: true,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'products'), createPayload);
      }

      Swal.fire({
        icon: 'success',
        title: editProduct ? 'Updated!' : 'Added!',
        text: editProduct ? 'Product has been updated successfully' : 'Product has been added successfully',
        confirmButtonText: 'OK',
        timer: 3000
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
      console.error('Error adding/updating product:', error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Failed', 
        text: error.message || 'Failed to add product. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
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
      <div className="bg-dark-card rounded-lg shadow-lg p-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
              Price (EGP)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter price"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent resize-none text-white placeholder-gray-400"
              placeholder="Enter product description"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
            >
              <option value="">Select category</option>
              <option value="t-shirt">T-Shirts</option>
              <option value="hoodies">Hoodies</option>
              <option value="zip-up">Zip-Up</option>
              <option value="crow-nek">Crow Nek</option>
            </select>
          </div>

          {/* Sizes */}
          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Available Sizes
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categoryOptions[formData.category]?.sizes.map((size) => (
                  <label key={size} className="flex items-center text-white">
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
              <label className="block text-sm font-medium text-white mb-2">
                Available Colors
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categoryOptions[formData.category]?.colors.map((color) => (
                  <label key={color} className="flex items-center text-white">
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
            <label className="block text-sm font-medium text-white mb-2">
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
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Upload Images
            </label>
            {editProduct ? (
              <p className="text-xs text-gray-400 mt-1">In edit mode, uploading images is optional. Existing images will remain if you don't upload new ones.</p>
            ) : null}
            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-300 mt-2">
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
              disabled={!authReady || !user || isSubmitting}
              className="flex-1 bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  {editProduct ? 'Updating...' : 'Adding...'}
                </div>
              ) : (!authReady || !user) ? 'Sign in required' : (editProduct ? 'Update Product' : 'Add New Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
