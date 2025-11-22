import promoCodeService from '../promoCodeService';

// Mock Firebase
jest.mock('../../firebase/config', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  Timestamp: {
    fromDate: jest.fn((date) => ({ toDate: () => date }))
  }
}));

describe('PromoCodeService', () => {
  describe('validatePromoCodeData', () => {
    test('should validate correct promo code data', () => {
      const validData = {
        code: 'SUMMER20',
        discountPercentage: 20,
        usageLimit: 100,
        validityDays: 7
      };

      expect(() => {
        promoCodeService.validatePromoCodeData(validData);
      }).not.toThrow();
    });

    test('should throw error for invalid code name', () => {
      const invalidData = {
        code: '',
        discountPercentage: 20,
        usageLimit: 100,
        validityDays: 7
      };

      expect(() => {
        promoCodeService.validatePromoCodeData(invalidData);
      }).toThrow('Promo code name is required');
    });

    test('should throw error for invalid discount percentage', () => {
      const invalidData = {
        code: 'SUMMER20',
        discountPercentage: 80, // Too high
        usageLimit: 100,
        validityDays: 7
      };

      expect(() => {
        promoCodeService.validatePromoCodeData(invalidData);
      }).toThrow('Discount percentage must be between 5 and 70');
    });

    test('should throw error for invalid usage limit', () => {
      const invalidData = {
        code: 'SUMMER20',
        discountPercentage: 20,
        usageLimit: 0, // Too low
        validityDays: 7
      };

      expect(() => {
        promoCodeService.validatePromoCodeData(invalidData);
      }).toThrow('Usage limit must be at least 1');
    });
  });

  describe('calculateDiscountAmount', () => {
    test('should calculate correct discount amount', () => {
      const subtotal = 1000;
      const discountPercentage = 20;
      const expectedDiscount = 200;

      const result = promoCodeService.calculateDiscountAmount(subtotal, discountPercentage);
      expect(result).toBe(expectedDiscount);
    });

    test('should round discount amount correctly', () => {
      const subtotal = 333;
      const discountPercentage = 10;
      const expectedDiscount = 33; // 33.3 rounded to 33

      const result = promoCodeService.calculateDiscountAmount(subtotal, discountPercentage);
      expect(result).toBe(expectedDiscount);
    });
  });

  describe('calculateCodeStatus', () => {
    test('should return INACTIVE for inactive codes', () => {
      const promoCodeData = {
        isActive: false,
        expiresAt: { toDate: () => new Date(Date.now() + 86400000) }, // Tomorrow
        usedCount: 0,
        usageLimit: 100
      };

      const status = promoCodeService.calculateCodeStatus(promoCodeData);
      expect(status).toBe('INACTIVE');
    });

    test('should return EXPIRED for expired codes', () => {
      const promoCodeData = {
        isActive: true,
        expiresAt: { toDate: () => new Date(Date.now() - 86400000) }, // Yesterday
        usedCount: 0,
        usageLimit: 100
      };

      const status = promoCodeService.calculateCodeStatus(promoCodeData);
      expect(status).toBe('EXPIRED');
    });

    test('should return USED_UP for codes that reached usage limit', () => {
      const promoCodeData = {
        isActive: true,
        expiresAt: { toDate: () => new Date(Date.now() + 86400000) }, // Tomorrow
        usedCount: 100,
        usageLimit: 100
      };

      const status = promoCodeService.calculateCodeStatus(promoCodeData);
      expect(status).toBe('USED_UP');
    });

    test('should return ACTIVE for valid codes', () => {
      const promoCodeData = {
        isActive: true,
        expiresAt: { toDate: () => new Date(Date.now() + 86400000) }, // Tomorrow
        usedCount: 50,
        usageLimit: 100
      };

      const status = promoCodeService.calculateCodeStatus(promoCodeData);
      expect(status).toBe('ACTIVE');
    });
  });
});