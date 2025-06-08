// src/components/UserChangePassword.jsx
import React, { useState } from "react";
import axios from "axios";
import authService from "../services/auth/authService";

const UserChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState("");
  const [showNewPw, setShowNewPw] = useState("");
  const [showConfirmNewPw, setShowConfirmNewPw] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword === currentPassword) {
      return setMessage("A nova palavra-passe deve ser diferente da atual.");
    }

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
      setMessage(err.response?.data?.message || "Erro ao alterar palavra-passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4">
      <h2 className="text-xl font-semibold mb-2">Alterar palavra-passe</h2>
      <div className="relative">
        <input
          type={ showCurrentPw ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowCurrentPw(!showCurrentPw)}
          className="absolute right-3 top-1/2 text-sm text-blue-600"
        >
          {showCurrentPw ? "Esconder" : "Mostrar"}
        </button>
      </div>

      <div className="relative">
        <input
          type={showNewPw ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowNewPw(!showNewPw)}
          className="absolute right-3 top-1/2 text-sm text-blue-600"
        >
          {showNewPw ? "Esconder" : "Mostrar"}
        </button>
      </div>

      <div className="relative">
        <input
          type={showConfirmNewPw ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmNewPw(!showConfirmNewPw)}
          className="absolute right-3 top-1/2 text-sm text-blue-600"
        >
          {showConfirmNewPw ? "Esconder" : "Mostrar"}
        </button>
      </div>

      {message && <p className="text-red-600">{message}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "A alterar..." : "Alterar"}
        </button>
      </div>
    </form>
  );
};

export default UserChangePassword;