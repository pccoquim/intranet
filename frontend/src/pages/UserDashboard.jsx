// src/pages/UserDashboard.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import authService from "../services/auth/authService";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setMessage("A nova palavra-passe e a confirmação não coincidem.");
    }

    try {
      setLoading(true);
      let token = authService.getAccessToken();
      if (authService.isTokenExpired(token)) {
        token = await authService.refreshAccessToken();
        if (!token) throw new Error("Sessão expirada.");
      }

      await axios.put(
        "/api/users/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Palavra-passe alterada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao alterar palavra-passe.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Painel do Utilizador</h1>
      <p><strong>Utilizador:</strong> {user.username}</p>
      <p><strong>Administrador:</strong> {user.is_admin ? "Sim" : "Não"}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Alterar palavra-passe</h2>
      <form onSubmit={handleChangePassword} className="space-y-3">
        <div>
          <label className="block">Palavra-passe atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border px-3 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Nova palavra-passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Confirmar nova palavra-passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-1 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "A alterar..." : "Alterar palavra-passe"}
        </button>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default UserDashboard;