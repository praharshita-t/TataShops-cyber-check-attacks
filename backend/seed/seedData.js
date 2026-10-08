import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import initSchema from '../database/schema.js';

export const seedProducts = [
  {
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

export const seedDatabase = async () => {
  initSchema();

  // 1. Seed Products (if not already seeded)
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

  if (productCount === 0) {
    console.log('Seeding initial products...');
    const insertProductStmt = db.prepare(`
      INSERT INTO products (name, description, price, category, stock, image, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of seedProducts) {
      insertProductStmt.run(
        p.name,
        p.description,
        p.price,
        p.category,
        p.stock,
        p.image,
        p.rating
      );
    }
    console.log(`Seeded ${seedProducts.length} fictional products.`);
  } else {
    console.log(`Products table already contains ${productCount} items. Skipping product seed.`);
  }

  // 2. Seed Development Admin Account
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@tatashops.local');

  if (!existingAdmin) {
    console.log('Seeding local development admin account...');
    const adminPasswordHash = await bcrypt.hash('AdminLab2026!', 10);
    db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, 'admin', ?, ?)
    `).run(
      'TataShops Administrator',
      'admin@tatashops.local',
      adminPasswordHash,
      '+91 98765 43210',
      'Tata Cyber Security Lab, Admin Bay 1'
    );
    console.log('Admin account created: admin@tatashops.local / AdminLab2026!');
  }

  // 3. Seed Development Demo User Account
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('user@tatashops.local');

  if (!existingUser) {
    console.log('Seeding local development demo user...');
    const userPasswordHash = await bcrypt.hash('UserLab2026!', 10);
    db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, 'user', ?, ?)
    `).run(
      'Demo Customer',
      'user@tatashops.local',
      userPasswordHash,
      '+91 98765 01234',
      '42 Security Avenue, Cyber City'
    );
    console.log('Demo user account created: user@tatashops.local / UserLab2026!');
  }

  console.log('Database seeding process completed.');
};

// If run directly via node seed/seedData.js
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase()
    .then(() => {
      console.log('Seed script finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed script failed:', err);
      process.exit(1);
    });
}

export default seedDatabase;
