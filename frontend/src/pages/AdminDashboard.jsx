// src/pages/AdminDashboard.jsx
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>

      <button
        onClick={() => navigate("/userEdit")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gerir Utilizadores
      </button>
    </div>
  );
};

export default AdminDashboard;
