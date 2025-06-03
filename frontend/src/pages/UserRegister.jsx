// frontend/src/pages/UserRegister.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
  const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('As palavras-passe não coincidem.');
      return;
    }

    let timer; // declarar aqui o timer para usar no cleanup

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage('✅ Registo efetuado com sucesso! Verifique o seu email para ativar a conta.');
      setError('');
      // Redirecionar para login após 10 segundos se for recém-ativada
      timer = setTimeout(() => {
        navigate('/userLogin');
      }, 10000);
    } catch (err) {
      const errorMsg =
            err.response?.data?.message ||
            err.message ||
            'Ocorreu um erro ao registar.';
        setError(errorMsg);
        setMessage('');
        // Cleanup do timer
        return () => clearTimeout(timer);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Registo de Utilizador</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="username"
          placeholder="Nome de utilizador"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="firstname"
          placeholder="Nome próprio"
          value={form.firstname}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="lastname"
          placeholder="Apelido"
          value={form.lastname}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Palavra-passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar palavra-passe"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
          >
            {showConfirmPassword ? "Esconder" : "Mostrar"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registar
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Register;
