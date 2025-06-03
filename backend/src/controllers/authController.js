// backend/src/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { Op } from 'sequelize';

const SECRET_KEY = process.env.SECRET_KEY || 'segredo_super_secreto';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'segredo_super_secreto_refresh';

// REGISTO DE UTILIZADOR
export const register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    // Verificar se já existe utilizador
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username já existe.' });

    // Verificar se já existe email
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) 
      return res.status(400).json({ message: 'Email já está registado.' });

    // Encriptar palavra-passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador (ainda sem token)
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      is_admin: false,
      active: false
    });

    // Gerar token
    const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: '1d' });

    // Atualizar utilizador com token
    newUser.token = token;
    await newUser.save();

    // Link e conteúdo do email
    const activationLink = `http://localhost:3000/activate?token=${token}`;
    const emailContent = `
      <h3>Bem-vindo(a), ${firstname}!</h3>
      <p>Por favor, ativa a tua conta clicando no link abaixo:</p>
      <a href="${activationLink}">Ativar Conta</a>
    `;
    
    // Enviar email
    await sendEmail(newUser.email, 'Confirmação de Conta', emailContent);
    
    res.status(201).json({ message: 'Conta criada. Verifica o teu email para ativação.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ATIVAÇÃO DE CONTA
export const activateAccount = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    // Se o utilizador não existe retorna status 404
    if (!user) 
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    // Se a conta já está ativada, retorna status 200
    if (user.active)
       return res.status(201).json({ message: 'Conta já está ativada.'});
    // Ativa a conta
    user.active = true;
    user.token = null;
    await user.save();

    res.status(200).json({ message: 'Conta ativada com sucesso!'});
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
       where: {
        [Op.or]: [
          { username: login },
          { email: login }
        ] 
      }
    });

    if (!user)
       return res.status(404).json({ message: 'Utilizador não encontrado.' });

    if (!user.active)
      return res.status(403).json({ message: 'Conta ainda não foi ativada.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
       return res.status(401).json({ message: 'Palavra-passe incorreta.' });

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      SECRET_KEY,
      { expiresIn: '15m' }
    );

    // Gerar refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Salvar refresh token no banco de dados
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido.' });
    }
    
    // Verificar o refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    
    // Buscar o usuário
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    
    // Verificar se o token é válido (comparando com o armazenado no DB)
    if (user.refresh_token !== refreshToken) {
      return res.status(401).json({ message: 'Refresh token inválido.' });
    }
    
    // Gerar um novo access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      SECRET_KEY,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Erro no refresh token:', error);
    res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Invalidar o refresh token no banco de dados
    await User.update(
      { refresh_token: null },
      { where: { id: userId } }
    );
    
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};