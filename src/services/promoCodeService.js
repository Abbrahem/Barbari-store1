import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

class PromoCodeService {
  constructor() {
    this.collectionName = 'promoCodes';
    this.collection = collection(db, this.collectionName);
  }

  /**
   * Create a new promo code
   * @param {Object} codeData - The promo code data
   * @param {string} codeData.code - The promo code name
   * @param {number} codeData.discountPercentage - Discount percentage (5-70)
   * @param {number} codeData.usageLimit - Maximum number of uses
   * @param {number} codeData.validityDays - Number of days the code is valid
   * @returns {Promise<string>} - The created document ID
   */
  async createPromoCode(codeData) {
    try {
      // Validate input data
      this.validatePromoCodeData(codeData);

      // Check if code already exists
      const existingCode = await this.getPromoCodeByName(codeData.code);
      if (existingCode) {
        throw new Error('Promo code already exists');
      }

      // Calculate expiry date
      const now = new Date();
      const expiryDate = new Date(now.getTime() + (codeData.validityDays * 24 * 60 * 60 * 1000));

      const promoCodeDoc = {
        code: codeData.code.toUpperCase().trim(),
        discountPercentage: codeData.discountPercentage,
        usageLimit: codeData.usageLimit,
        usedCount: 0,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiryDate),
        isActive: true,
        createdBy: codeData.createdBy || 'admin'
      };

      const docRef = await addDoc(this.collection, promoCodeDoc);
      console.log('Promo code created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating promo code:', error);
      throw error;
    }
  }

  /**
   * Get all promo codes
   * @returns {Promise<Array>} - Array of promo codes
   */
  async getPromoCodes() {
    try {
      const q = query(this.collection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const promoCodes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        promoCodes.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to JavaScript dates
          createdAt: data.createdAt?.toDate(),
          expiresAt: data.expiresAt?.toDate(),
          // Calculate status
          status: this.calculateCodeStatus(data)
        });
      });

      return promoCodes;
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      throw error;
    }
  }

  /**
   * Get a promo code by its name
   * @param {string} codeName - The promo code name
   * @returns {Promise<Object|null>} - The promo code or null if not found
   */
  async getPromoCodeByName(codeName) {
    try {
      const q = query(this.collection, where('code', '==', codeName.toUpperCase().trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
        status: this.calculateCodeStatus(data)
      };
    } catch (error) {
      console.error('Error fetching promo code by name:', error);
      throw error;
    }
  }

  /**
   * Validate a promo code for use
   * @param {string} codeName - The promo code name
   * @returns {Promise<Object>} - Validation result
   */
  async validatePromoCode(codeName) {
    try {
      const promoCode = await this.getPromoCodeByName(codeName);
      
      if (!promoCode) {
        return {
          isValid: false,
          error: 'Invalid promo code',
          errorType: 'NOT_FOUND'
        };
      }

      // Check if code is active
      if (!promoCode.isActive) {
        return {
          isValid: false,
          error: 'Promo code is no longer active',
          errorType: 'INACTIVE'
        };
      }

      // Check if code has expired
      const now = new Date();
      if (promoCode.expiresAt && now > promoCode.expiresAt) {
        return {
          isValid: false,
          error: 'Promo code has expired',
          errorType: 'EXPIRED'
        };
      }

      // Check if usage limit has been reached
      if (promoCode.usedCount >= promoCode.usageLimit) {
        return {
          isValid: false,
          error: 'Promo code usage limit reached',
          errorType: 'USAGE_LIMIT_REACHED'
        };
      }

      return {
        isValid: true,
        promoCode: promoCode,
        discountPercentage: promoCode.discountPercentage
      };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return {
        isValid: false,
        error: 'Error validating promo code',
        errorType: 'VALIDATION_ERROR'
      };
    }
  }

  /**
   * Apply a promo code (increment usage count)
   * @param {string} codeId - The promo code document ID
   * @returns {Promise<void>}
   */
  async applyPromoCode(codeId) {
    try {
      const promoCodeRef = doc(db, this.collectionName, codeId);
      const promoCode = await this.getPromoCodeByName(codeId);
      
      if (!promoCode) {
        throw new Error('Promo code not found');
      }

      const newUsedCount = promoCode.usedCount + 1;
      const updateData = {
        usedCount: newUsedCount
      };

      // If usage limit is reached, deactivate the code
      if (newUsedCount >= promoCode.usageLimit) {
        updateData.isActive = false;
      }

      await updateDoc(promoCodeRef, updateData);
      console.log('Promo code usage updated:', codeId);
    } catch (error) {
      console.error('Error applying promo code:', error);
      throw error;
    }
  }

  /**
   * Delete a promo code
   * @param {string} codeId - The promo code document ID
   * @returns {Promise<void>}
   */
  async deletePromoCode(codeId) {
    try {
      const promoCodeRef = doc(db, this.collectionName, codeId);
      await deleteDoc(promoCodeRef);
      console.log('Promo code deleted:', codeId);
    } catch (error) {
      console.error('Error deleting promo code:', error);
      throw error;
    }
  }

  /**
   * Calculate discount amount
   * @param {number} subtotal - Order subtotal
   * @param {number} discountPercentage - Discount percentage
   * @returns {number} - Discount amount
   */
  calculateDiscountAmount(subtotal, discountPercentage) {
    return Math.round((subtotal * discountPercentage) / 100);
  }

  /**
   * Validate promo code data before creation
   * @param {Object} codeData - The promo code data to validate
   */
  validatePromoCodeData(codeData) {
    if (!codeData.code || typeof codeData.code !== 'string' || codeData.code.trim().length === 0) {
      throw new Error('Promo code name is required');
    }

    if (!codeData.discountPercentage || 
        typeof codeData.discountPercentage !== 'number' || 
        codeData.discountPercentage < 5 || 
        codeData.discountPercentage > 70) {
      throw new Error('Discount percentage must be between 5 and 70');
    }

    if (!codeData.usageLimit || 
        typeof codeData.usageLimit !== 'number' || 
        codeData.usageLimit < 1) {
      throw new Error('Usage limit must be at least 1');
    }

    if (!codeData.validityDays || 
        typeof codeData.validityDays !== 'number' || 
        codeData.validityDays < 1) {
      throw new Error('Validity days must be at least 1');
    }
  }

  /**
   * Calculate the status of a promo code
   * @param {Object} promoCodeData - The promo code data
   * @returns {string} - Status string
   */
  calculateCodeStatus(promoCodeData) {
    if (!promoCodeData.isActive) {
      return 'INACTIVE';
    }

    const now = new Date();
    if (promoCodeData.expiresAt && now > promoCodeData.expiresAt.toDate()) {
      return 'EXPIRED';
    }

    if (promoCodeData.usedCount >= promoCodeData.usageLimit) {
      return 'USED_UP';
    }

    return 'ACTIVE';
  }
}

// Export singleton instance
export const promoCodeService = new PromoCodeService();
export default promoCodeService;