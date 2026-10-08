import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
