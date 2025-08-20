// Mock products data for when backend is not available
export const mockProducts = [
  {
    id: '1',
    name: 'قميص باربري كلاسيكي',
    price: 299,
    originalPrice: 399,
    category: 'قمصان',
    thumbnail: '/static/media/barbritshirt.3542b88d28e5d6a7cfa7.jpg',
    images: ['/static/media/barbritshirt.3542b88d28e5d6a7cfa7.jpg'],
    soldOut: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أبيض', 'أسود', 'أزرق']
  },
  {
    id: '2',
    name: 'بنطلون جينز عصري',
    price: 199,
    category: 'بناطيل',
    thumbnail: '/static/media/pants3.247a8e1cc1381dbd00f7.png',
    images: ['/static/media/pants3.247a8e1cc1381dbd00f7.png'],
    soldOut: false,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['أزرق', 'أسود']
  },
  {
    id: '3',
    name: 'تيشيرت باربري مميز',
    price: 149,
    category: 'تيشيرتات',
    thumbnail: '/static/media/hero.15bcf502ffb693ffb52c.jpg',
    images: ['/static/media/hero.15bcf502ffb693ffb52c.jpg'],
    soldOut: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['أحمر', 'أبيض', 'أسود']
  }
];
