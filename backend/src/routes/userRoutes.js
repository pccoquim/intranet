// backend/src/routes/userRoutes.js
import express from 'express';
import { 
    getAllUsers, 
    updateUser, 
    changePassword 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Rota para listar utilizadores
router.get('/', authMiddleware.authMiddleware, getAllUsers);
// Rota para alteração da palavra-passe pelo utilizador
router.put('/change-password', authMiddleware.authMiddleware, changePassword);
// Rota para atualizar um utilizador
router.put('/:id', authMiddleware.authMiddleware, updateUser);

export default router;