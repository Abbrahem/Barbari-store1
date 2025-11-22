import React from 'react';
import Swal from 'sweetalert2';

const PromoCodeList = ({ promoCodes, onDelete, onRefresh, loading }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-400', label: 'Active' },
      EXPIRED: { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-400', label: 'Expired' },
      USED_UP: { bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-400', label: 'Used Up' },
      INACTIVE: { bg: 'bg-gray-900/30', border: 'border-gray-600', text: 'text-gray-400', label: 'Inactive' }
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = async (codeId, codeName) => {
    const result = await Swal.fire({
      title: 'Delete Promo Code?',
      text: `Are you sure you want to delete "${codeName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the promo code',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await onDelete(codeId);
        
        // Show success
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Promo code "${codeName}" has been deleted successfully.`,
          confirmButtonText: 'OK',
          timer: 3000
        });

        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Error deleting promo code:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete promo code. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4">Existing Promo Codes</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-400 ml-2">Loading promo codes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-semibold">Existing Promo Codes</h2>
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium self-start sm:self-auto"
        >
          Refresh
        </button>
      </div>

      {promoCodes.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <p className="text-gray-400">No promo codes created yet</p>
          <p className="text-gray-500 text-sm mt-1">Create your first promo code using the form above</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {promoCodes.map((promoCode) => (
            <div key={promoCode.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4 sm:p-6">
              {/* Header - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h3 className="text-white font-semibold text-xl">{promoCode.code}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-medium text-lg">{promoCode.discountPercentage}% OFF</span>
                    {getStatusBadge(promoCode.status)}
                  </div>
                </div>
                
                {/* Delete Button - Simplified */}
                <button
                  onClick={() => handleDelete(promoCode.id, promoCode.code)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium self-start"
                  title="Delete promo code"
                >
                  Delete
                </button>
              </div>

              {/* Details Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm block">Usage:</span>
                  <p className="text-white font-semibold text-lg">
                    {promoCode.usedCount}/{promoCode.usageLimit}
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm block">Created:</span>
                  <p className="text-white font-medium">{formatDate(promoCode.createdAt)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm block">Expires:</span>
                  <p className="text-white font-medium">{formatDate(promoCode.expiresAt)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm block">Status:</span>
                  <p className="text-white font-medium">{promoCode.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCodeList;