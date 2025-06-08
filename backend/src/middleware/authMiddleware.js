// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) { 
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

// Middleware de verificação se é admin
const adminMiddleware = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

export default { authMiddleware, adminMiddleware };
