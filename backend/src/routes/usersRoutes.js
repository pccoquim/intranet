// backend/src/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'is_admin', 'active']
        });
        res.json(users);
    } catch (error) {
        console.error('Erro ao obter utilizadores:', error);
        res.status(500).json({ message: 'Erro ao obter utilizadores.' });
    }
});

// PUT update user role
router.put('/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    const { is_admin } = req.body;
    const { id } = req.params;

    try {
        await User.update({ is_admin }, {
            where: { id }
        });
        res.json({ message: 'Tipo atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar tipo de utilizador:', error);
        res.status(500).json({ message: 'Erro ao atualizar tipo de utilizador.' });
    }
});

export default router;
