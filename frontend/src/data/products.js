/**
 * Dummy product data for Phase 1 frontend.
 * In Phase 2, this will be replaced with API calls to GET /api/products.
 */

const products = [
  {
    id: 1,
    name: 'SecureBook Pro 14',
    description:
      'High-performance 14-inch laptop with a crisp Retina display, 16GB RAM, and 512GB SSD. Perfect for developers and power users who demand speed and reliability.',
    price: 55999,
    category: 'Laptops',
    stock: 12,
    image: '/images/laptop-1.svg',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'SecureBook Air',
    description:
      'Ultra-thin and lightweight laptop with an all-day battery. Features a 13.3-inch display, 8GB RAM, and 256GB SSD. Ideal for students and on-the-go professionals.',
    price: 48999,
    category: 'Laptops',
    stock: 8,
    image: '/images/laptop-2.svg',
    rating: 4.3,
  },
  {
    id: 3,
    name: 'SoundMax Wireless',
    description:
      'Premium over-ear wireless headphones with active noise cancellation. 30-hour battery life, deep bass, and crystal-clear audio for an immersive listening experience.',
    price: 3499,
    category: 'Audio',
    stock: 25,
    image: '/images/audio-1.svg',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'BassCore 500',
    description:
      'Compact wireless earbuds with punchy bass and a secure fit. IPX5 water resistant with 24-hour total playtime including the charging case.',
    price: 2999,
    category: 'Audio',
    stock: 18,
    image: '/images/audio-2.svg',
    rating: 4.1,
  },
  {
    id: 5,
    name: 'KeyPro Mechanical',
    description:
      'Full-size mechanical keyboard with customizable RGB backlighting and hot-swappable switches. Durable aluminium frame with N-key rollover.',
    price: 2499,
    category: 'Accessories',
    stock: 30,
    image: '/images/accessory-1.svg',
    rating: 4.6,
  },
  {
    id: 6,
    name: 'ClickMouse X',
    description:
      'Ergonomic wireless mouse with a precision optical sensor, adjustable DPI up to 16000, and a rechargeable battery that lasts up to 70 hours.',
    price: 899,
    category: 'Accessories',
    stock: 40,
    image: '/images/accessory-2.svg',
    rating: 4.2,
  },
  {
    id: 7,
    name: 'PowerHub 65W',
    description:
      'Compact 65W GaN USB-C charger with dual ports. Fast charge your laptop and phone simultaneously. Universal compatibility with PD 3.0 and QC 4.0.',
    price: 2199,
    category: 'Accessories',
    stock: 20,
    image: '/images/accessory-3.svg',
    rating: 4.4,
  },
  {
    id: 8,
    name: 'VisionView 24',
    description:
      '24-inch Full HD IPS monitor with 75Hz refresh rate. Ultra-slim bezels, VESA mount compatible, and built-in blue-light filter for comfortable viewing.',
    price: 12999,
    category: 'Monitors',
    stock: 15,
    image: '/images/monitor-1.svg',
    rating: 4.3,
  },
  {
    id: 9,
    name: 'VisionView 27',
    description:
      '27-inch QHD IPS monitor with 165Hz refresh rate and 1ms response time. HDR400, 99% sRGB colour accuracy. Ideal for creative work and gaming.',
    price: 18999,
    category: 'Monitors',
    stock: 10,
    image: '/images/monitor-2.svg',
    rating: 4.8,
  },
  {
    id: 10,
    name: 'SmartTab X10',
    description:
      '10.4-inch tablet with a vivid AMOLED display, 6GB RAM, and 128GB storage. Includes an S-Pen for note-taking. Perfect for media consumption and productivity.',
    price: 18999,
    category: 'Tablets',
    stock: 8,
    image: '/images/tablet-1.svg',
    rating: 4.5,
  },
];

/**
 * Get all products.
 * Replace with: fetch('/api/products') in Phase 2.
 */
export const getProducts = () => products;

/**
 * Get a single product by ID.
 * Replace with: fetch(`/api/products/${id}`) in Phase 2.
 */
export const getProductById = (id) =>
  products.find((p) => p.id === Number(id));

/**
 * Get all unique categories.
 */
export const getCategories = () =>
  [...new Set(products.map((p) => p.category))];

export default products;
