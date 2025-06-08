// backend\src\routes\authRoutes.js
import express from 'express';
import { 
    register,
    login,
    activateAccount,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { updateCookieConsent } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/activate', activateAccount); // Confirmação via token do email
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware.authMiddleware, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/cookieConsent', authMiddleware.authMiddleware, updateCookieConsent);

export default router;
