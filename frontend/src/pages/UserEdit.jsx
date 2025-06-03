// src/pages/UserEdit.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authService from '../services/auth/authService';

const UserEdit = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      let token = authService.getAccessToken();

      // Se estiver expirado, tenta renovar
      if (authService.isTokenExpired(token)) {
        token = await authService.refreshAccessToken();
        if (!token) throw new Error('Sessão expirada.');
      }

      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err);
      setError('Erro ao carregar utilizadores.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const handleSave = async (user) => {
    try {
      let token = authService.getAccessToken();

      if (authService.isTokenExpired(token)) {
        token = await authService.refreshAccessToken();
        if (!token) throw new Error('Sessão expirada.');
      }

      await axios.put(`http://localhost:5000/api/users/${user.id}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Utilizador atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao guardar utilizador:', err);
      alert('Erro ao guardar utilizador.');
    }
  };

  if (loading) return <p>A carregar utilizadores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Utilizadores</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Primeiro Nome</th>
            <th className="p-2 border">Último Nome</th>
            <th className="p-2 border">Admin</th>
            <th className="p-2 border">Ativo</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={user.firstname || ''}
                  onChange={(e) => handleChange(index, 'firstname', e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={user.lastname || ''}
                  onChange={(e) => handleChange(index, 'lastname', e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={user.is_admin}
                  onChange={(e) => handleChange(index, 'is_admin', e.target.checked)}
                />
              </td>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={user.active}
                  onChange={(e) => handleChange(index, 'active', e.target.checked)}
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleSave(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserEdit;