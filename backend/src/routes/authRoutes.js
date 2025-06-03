// backend\src\routes\authRoutes.js
import express from 'express';
import { register, login, activateAccount, refreshToken, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/activate', activateAccount); // Confirmação via token do email
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
