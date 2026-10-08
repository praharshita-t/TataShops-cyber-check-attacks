import express from 'express';
import {
  getUsers,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin routes require both authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/users', getUsers);
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
