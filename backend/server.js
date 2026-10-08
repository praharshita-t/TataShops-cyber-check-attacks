import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import initSchema from './database/schema.js';
import seedDatabase from './seed/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Schema & Seed Data automatically on start
try {
  initSchema();
  await seedDatabase();
} catch (error) {
  console.error('Database initialization error:', error);
}

// Intentionally vulnerable: Permissive wildcard CORS configuration (A05 Security Misconfiguration)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint for status verification and scanning baselines
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TataShops API is running',
    version: '1.0.0',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TataShops REST API is running normally.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware (Intentionally vulnerable: Verbose stack traces leaked to client)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: {
      message: err.message,
      stack: err.stack,
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  TataShops Backend Server Started`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Database: SQLite (backend/database/tatashops.db)`);
  console.log(`  API Base URL: http://localhost:${PORT}/api`);
  console.log(`========================================`);
});
