import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GOVERNORATE':
      return { ...state, selectedGovernorate: action.payload };
    case 'APPLY_PROMO_CODE':
      return { ...state, appliedPromoCode: action.payload };
    case 'REMOVE_PROMO_CODE':
      return { ...state, appliedPromoCode: null };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color)
        )
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [], selectedGovernorate: null, appliedPromoCode: null };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], selectedGovernorate: null, appliedPromoCode: null
  });

  const addToCart = (product, size, color, quantity = 1) => {
    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    const image = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0] : (product.thumbnail || placeholder);
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: product.id, name: product.name, price: product.price, image, size, color, quantity }
    });
  };

  const removeFromCart = (productId, size, color) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId, size, color } });
  };

  const updateQuantity = (productId, size, color, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, size, color, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const getTotalItems = () => state.items.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const applyPromoCode = (promoCodeData) => {
    dispatch({ type: 'APPLY_PROMO_CODE', payload: promoCodeData });
  };

  const removePromoCode = () => dispatch({ type: 'REMOVE_PROMO_CODE' });

  const getDiscountAmount = () => {
    if (!state.appliedPromoCode) return 0;
    const subtotal = getTotalPrice();
    return Math.round((subtotal * state.appliedPromoCode.discountPercentage) / 100);
  };

  const getTotalAfterDiscount = () => getTotalPrice() - getDiscountAmount();

  const setSelectedGovernorate = (governorate) => {
    dispatch({ type: 'SET_GOVERNORATE', payload: governorate });
  };

  const getShippingInfo = () => {
    const totalPrice = getTotalAfterDiscount();
    if (totalPrice >= 3000) {
      return { cost: 0, message: 'الشحن مجاني للطلبات فوق 3000 جنيه', isFree: true };
    }
    if (!state.selectedGovernorate) return { cost: 0, message: '', isFree: false };
    
    const governorateName = state.selectedGovernorate.name;
    if (governorateName === 'السويس') {
      return { cost: 50, message: 'سعر التوصيل: 50 جنيه (السويس)', isFree: false };
    }
    
    const deltaAndNorthGovernorates = [
      'الدقهلية', 'دمياط', 'الشرقية', 'الغربية', 'كفر الشيخ', 'المنوفية', 'البحيرة', 
      'المنصورة', 'الزقازيق', 'طنطا', 'شبين الكوم', 'دسوق', 'ميت غمر', 'بلبيس', 
      'منيا القمح', 'كفر الدوار', 'كفر الزيات', 'القاهرة', 'الجيزة', 'القليوبية', 
      'الإسكندرية', 'بورسعيد', 'الإسماعيلية', 'شمال سيناء', 'جنوب سيناء', 'مرسى مطروح',
      'بورفؤاد', 'المنصورة الجديدة', 'العاشر من رمضان', 'العريش', 'الطور', 'رأس سدر'
    ];
    
    if (deltaAndNorthGovernorates.includes(governorateName)) {
      return { cost: 70, message: 'سعر التوصيل: 70 جنيه (محافظات الدلتا والشمال)', isFree: false };
    }
    
    return { cost: 120, message: 'سعر التوصيل: 120 جنيه (محافظات الصعيد)', isFree: false };
  };
  
  const getShippingCost = () => getShippingInfo().cost;
  const getTotalWithShipping = () => getTotalAfterDiscount() + getShippingCost();
  const getShippingMessage = () => getShippingInfo().message;
  const isShippingFree = () => getShippingInfo().isFree;

  return (
    <CartContext.Provider value={{
      items: state.items, 
      selectedGovernorate: state.selectedGovernorate, 
      appliedPromoCode: state.appliedPromoCode,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getTotalItems, 
      getTotalPrice,
      applyPromoCode, 
      removePromoCode, 
      getDiscountAmount, 
      getTotalAfterDiscount,
      setSelectedGovernorate, 
      getShippingCost, 
      getTotalWithShipping, 
      getShippingMessage, 
      isShippingFree
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};