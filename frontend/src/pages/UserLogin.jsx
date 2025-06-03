// frontend/src/pages/UserLogin.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ login: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.login, form.password);
    } catch (err) {
      setError("❌ Credenciais inválidas ou conta não ativada.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="login"
          value={form.login}
          onChange={handleChange}
          placeholder="Login ou Nome de Utilizador"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Palavra-passe"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
          >
            {showPassword ? "Esconder" : "Mostrar"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
