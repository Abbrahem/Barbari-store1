import React, { useState } from 'react';
import promoCodeService from '../services/promoCodeService';

const PromoCodeInput = ({ onCodeApplied, orderTotal, appliedCode, onCodeRemoved }) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const handleValidateCode = async () => {
    if (!code.trim()) {
      setValidationResult({
        isValid: false,
        error: 'Please enter a promo code',
        errorType: 'EMPTY_CODE'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await promoCodeService.validatePromoCode(code.trim());
      
      if (result.isValid) {
        const discountAmount = promoCodeService.calculateDiscountAmount(
          orderTotal, 
          result.discountPercentage
        );
        
        const successResult = {
          ...result,
          discountAmount,
          code: code.trim()
        };
        
        setValidationResult(successResult);
        
        if (onCodeApplied) {
          onCodeApplied(successResult);
        }
        
        setCode('');
      } else {
        setValidationResult(result);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setValidationResult({
        isValid: false,
        error: 'Error validating promo code. Please try again.',
        errorType: 'VALIDATION_ERROR'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCode = () => {
    setCode('');
    setValidationResult(null);
    if (onCodeRemoved) {
      onCodeRemoved();
    }
  };

  const getErrorMessage = (result) => {
    switch (result.errorType) {
      case 'NOT_FOUND':
        return 'Invalid promo code';
      case 'EXPIRED':
        return 'Promo code has expired';
      case 'USAGE_LIMIT_REACHED':
        return 'Promo code usage limit reached';
      case 'INACTIVE':
        return 'Promo code is no longer active';
      case 'EMPTY_CODE':
        return 'Please enter a promo code';
      default:
        return result.error || 'Invalid promo code';
    }
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700 w-full">
      <h3 className="text-white text-base sm:text-lg font-semibold mb-3">Promo Code</h3>
      
      {appliedCode ? (
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-green-900/30 border border-green-600 rounded-lg p-3 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-medium text-sm sm:text-base truncate">{appliedCode.code}</span>
              </div>
              <span className="text-green-400 text-sm sm:text-base font-medium">(-{appliedCode.discountAmount} EGP)</span>
            </div>
            <button
              onClick={handleRemoveCode}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs sm:text-sm transition-colors self-start sm:self-auto flex-shrink-0"
              title="Remove promo code"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter promo code"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base min-w-0"
              disabled={isValidating}
            />
            <button
              onClick={handleValidateCode}
              disabled={isValidating || !code.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium flex-shrink-0"
            >
              {isValidating ? 'Checking...' : 'Check'}
            </button>
          </div>

          {validationResult && (
            <div className={`p-3 rounded-lg border w-full ${
              validationResult.isValid 
                ? 'bg-green-900/30 border-green-600 text-green-400' 
                : 'bg-red-900/30 border-red-600 text-red-400'
            }`}>
              {validationResult.isValid ? (
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Code applied! You save {validationResult.discountAmount} EGP</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base break-words">{getErrorMessage(validationResult)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;