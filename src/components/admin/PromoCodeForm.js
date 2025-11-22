import React, { useState } from 'react';
import promoCodeService from '../../services/promoCodeService';

const PromoCodeForm = ({ onCodeCreated }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 10,
    usageLimit: 100,
    validityDays: 7
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const discountOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70];
  const validityOptions = [
    { value: 1, label: '1 day' },
    { value: 2, label: '2 days' },
    { value: 3, label: '3 days' },
    { value: 4, label: '4 days' },
    { value: 5, label: '5 days' },
    { value: 6, label: '6 days' },
    { value: 7, label: '1 week' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      setError('Please enter a promo code name');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const codeData = {
        code: formData.code.trim(),
        discountPercentage: parseInt(formData.discountPercentage),
        usageLimit: parseInt(formData.usageLimit),
        validityDays: parseInt(formData.validityDays)
      };

      await promoCodeService.createPromoCode(codeData);
      
      setSuccess(`Promo code "${formData.code}" created successfully!`);
      setFormData({
        code: '',
        discountPercentage: 10,
        usageLimit: 100,
        validityDays: 7
      });

      if (onCodeCreated) {
        onCodeCreated();
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
      setError(error.message || 'Failed to create promo code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-6">Create New Promo Code</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Code Name
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g., SUMMER20"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Discount Percentage
          </label>
          <select
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
          >
            {discountOptions.map(percentage => (
              <option key={percentage} value={percentage}>
                {percentage}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Usage Limit
          </label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            min="1"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
            required
          />
          <p className="text-gray-400 text-sm mt-1">Maximum number of times this code can be used</p>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Valid For
          </label>
          <select
            name="validityDays"
            value={formData.validityDays}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
          >
            {validityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-600 text-green-400 p-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !formData.code.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          {isSubmitting ? 'Creating Code...' : 'Generate Code'}
        </button>
      </form>
    </div>
  );
};

export default PromoCodeForm;