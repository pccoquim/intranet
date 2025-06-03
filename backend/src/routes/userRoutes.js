// backend/src/routes/userRoutes.js
import express from 'express';
import { getAllUsers, updateUser, changePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // se usares JWT auth

const router = express.Router();

// Requer autenticação e ser admin, se quiseres proteger
router.get('/', authMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, updateUser);
router.put('/change-password', authMiddleware, changePassword);

export default router;