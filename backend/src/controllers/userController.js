// backebd/src/controllers/userController.js
import bcrypt from 'bcrypt';
import User from '../models/User';

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
  try {
    // Verificar se o utilizador é admin
    if (!req.user.is_admin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }

    const { id } = req.params;
    const { firstname, lastname, is_admin, active } = req.body;

    // Encontrar o utilizador
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Não permitir que um admin se desative a si próprio
    if (user.id === req.user.id && active === false) {
      return res.status(400).json({ message: 'Não pode desativar a sua própria conta.' });
    }

    // Not permitir que um admin remova os seus próprios privilégios de admin se for o único admin
    if (user.id === req.user.id && is_admin === false) {
      const adminCount = await User.count({ where: { is_admin: true } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Não pode remover privilégios de admin. Deve existir pelo menos um administrador.' });
      }
    }

    // Atualizar apenas os campos permitidos
    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (is_admin !== undefined) updateData.is_admin = is_admin;
    if (active !== undefined) updateData.active = active;

    await user.update(updateData);

    // Retornar o utilizador atualizado
    const updatedUser = await User.findByPk(id, {
      attributes: ['id', 'username', 'firstname', 'lastname', 'email', 'is_admin', 'active', 'createdAt']
    });

    res.json({ 
      message: 'Utilizador atualizado com sucesso!', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Palavra-passe atual incorreta.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Palavra-passe alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar palavra-passe:', error);
    res.status(500).json({ message: 'Erro ao alterar palavra-passe.' });
  }
};