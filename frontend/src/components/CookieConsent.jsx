// frontend/src/components/CookieConsent.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CookieConsent() {
  const { user, accessToken } = useContext(AuthContext);
  // Mostrar aviso só se não tiver consentido e não estiver logado
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent') === 'true';
    const isUserLoggedIn = !!user && Object.keys(user).length > 0;

    if (!isUserLoggedIn && !consentGiven) {
      setVisible(true);
    }
  }, [user]);

  const handleAccept = async () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);

    // Se o utilizador estiver autenticado, guardar no backend também
    if (user && accessToken) {
      try {
        await axios.post(
          'http://localhost:5000/api/user/cookie-consent',
          { consent: true },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } catch (error) {
        console.error('Erro ao guardar consentimento no backend', error);
      }
    }
  };

  if (!visible) return null;


  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded shadow-lg max-w-lg w-full z-50">
      <p>
        Este site utiliza cookies para melhorar a tua experiência. Ao continuares, aceitas a nossa{' '}
        <a href="/privacy-policy" className="underline">Política de Privacidade</a>.
      </p>
      <button
        onClick={handleAccept}
        className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Aceitar Cookies
      </button>
    </div>
  );
}