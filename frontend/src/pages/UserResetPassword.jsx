// frontend/src/pages/UserResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [novaPass, setNovaPass] = useState('');
  const [confirmaPass, setConfirmaPass] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (novaPass !== confirmaPass) {
      setErro('As palavras-passe não coincidem.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token: token,
        newPassword: novaPass,
      });
      setMensagem(response.data.message || 'Palavra-passe atualizada com sucesso!');

      // Limpa o token da URL
      setSearchParams({});

      // Aguarda 2 segundos e redireciona para o login
      setTimeout(() => {
        navigate('/login');  // <-- redireciona para a página de login
      }, 2000);
    } catch (err) {
      setErro('Erro ao atualizar palavra-passe. O token pode estar inválido ou expirado.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Definir Nova Palavra-passe</h1>
      <form onSubmit={handleSubmit}>
        <div className="relative">
            <input
            type="password"
            placeholder="Nova palavra-passe"
            value={novaPass}
            required
            onChange={(e) => setNovaPass(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded"
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
            type="password"
            placeholder="Confirmar palavra-passe"
            value={confirmaPass}
            required
            onChange={(e) => setConfirmaPass(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
                {showConfirmPassword ? "Esconder" : "Mostrar"}
            </button>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Atualizar palavra-passe
        </button>
      </form>
      {mensagem && <p className="mt-4 text-green-600">{mensagem}</p>}
      {erro && <p className="mt-4 text-red-600">{erro}</p>}
    </div>
  );
}