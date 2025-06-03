// frontend/src/pages/UserActivateAccount.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function ActivateAccount() {
  const [status, setStatus] = useState("A ativar a conta...");
  const [isActivated, setIsActivated] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("Token inválido ou não fornecido.");
      return;
    }

    let timer; // declarar aqui o timer para usar no cleanup

    axios
      .get(`http://localhost:5000/api/auth/activate?token=${token}`)
      .then((response) => {
          setStatus(response.data.message);
          setIsActivated(true);
          // Redirecionar para login após 10 segundos se for recém-ativada
          timer = setTimeout(() => {
            navigate("/userLogin"); // 
          }, 10000);
        })
          .catch((error) => {
            setStatus(error.response?.data?.message || "Erro ao ativar a conta.");
            setIsActivated(false);
          });
          // Cleanup do timer
          return () => clearTimeout(timer);
    }, [searchParams, navigate]);
     
    const handleGoToLogin = () => {
      navigate("/userLogin");
    };

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>Ativação de conta</h2>
        <p style={{ textAlign: 'center' }}>{status}</p>
        {isActivated && (
          <button onClick={handleGoToLogin}>Ir para Login</button>
        )}
      </div>
    </div>
  );
}

export default ActivateAccount;
