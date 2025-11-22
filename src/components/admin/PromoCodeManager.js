import React, { useState, useEffect } from 'react';
import PromoCodeForm from './PromoCodeForm';
import PromoCodeList from './PromoCodeList';
import promoCodeService from '../../services/promoCodeService';

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      setError('');
      const codes = await promoCodeService.getPromoCodes();
      setPromoCodes(codes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      setError('Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeCreated = () => {
    fetchPromoCodes();
  };

  const handleDeleteCode = async (codeId) => {
    try {
      await promoCodeService.deletePromoCode(codeId);
      setPromoCodes(prev => prev.filter(code => code.id !== codeId));
    } catch (error) {
      console.error('Error deleting promo code:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PromoCodeForm onCodeCreated={handleCodeCreated} />
      
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <PromoCodeList
        promoCodes={promoCodes}
        onDelete={handleDeleteCode}
        onRefresh={fetchPromoCodes}
        loading={loading}
      />
    </div>
  );
};

export default PromoCodeManager;