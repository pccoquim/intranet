// frontend/src/pages/UserForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMensagem(response.data.message || 'Se o email existir, receberás instruções.');
    } catch (err) {
      setErro('Erro ao tentar recuperar a palavra-passe.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Recuperar Palavra-passe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Enviar link de recuperação
        </button>
      </form>
      {mensagem && <p className="mt-4 text-green-600">{mensagem}</p>}
      {erro && <p className="mt-4 text-red-600">{erro}</p>}
    </div>
  );
}