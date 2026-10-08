import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);

export default router;
