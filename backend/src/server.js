// backend\src\server.js
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Iniciar servidor
const PORT = process.env.BC_PORT || 5000;
app.listen(PORT, async () => {
    try {
    await sequelize.authenticate();
    console.log('Conexão ao MySQL estabelecida com sucesso!');
    console.log(`Servidor iniciado na porta ${PORT}`);
    } catch (error) {
        console.error('Erro na conexão ao MySQL:', error);
    }
});

app.use('/api/auth', authRoutes);

