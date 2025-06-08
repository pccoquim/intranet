// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth/authService"; 
import axios from "axios";
// Criar o contexto
export const AuthContext = createContext();
// Provider de contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    
  // Função de logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      authService.clearTokens();
      setUser(null);
      navigate("/userLogin");
    }
  }, [navigate]);

  // Configurar interceptor para renovação automática de token
  useEffect(() => {
    // Interceptor de resposta para tratar tokens expirados
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Se o erro for 401 e não for uma tentativa de refresh ou login
        if (
          error.response?.status === 401 && 
          !originalRequest._retry && 
          !originalRequest.url?.includes('refresh-token') &&
          !originalRequest.url?.includes('login')
        ) {
          originalRequest._retry = true;
          
          try {
            // Tentar renovar o token
            const newToken = await authService.refreshAccessToken();
            
            if (newToken) {
              // Se conseguir um novo token, atualizar o header e refazer a requisição
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              // Se não conseguir renovar, fazer logout
              await logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Limpeza do interceptor quando o componente for desmontado
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  // Verificar se há um usuário logado ao carregar a aplicação
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = authService.getAccessToken();
        let validToken = token;
        
        if (token && authService.isTokenExpired(token)) {
          // Se estiver expirado, tentar renovar
          const newToken = await authService.refreshAccessToken();
            
          if (!newToken) {
            // Se não conseguir renovar, fazer logout
            setUser(null);
            setLoading(false);
            return;
          }

          authService.setTokens(newToken, authService.getRefreshToken());
          validToken = newToken;
        }
          
        if (validToken) {
          const payload = authService.decodeToken(validToken);
          if (payload) {
            setUser({
              id: payload.id,
              username: payload.username,
              is_admin: payload.is_admin
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, [logout]);

  // Função de login
  const login = async (login, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { login, password });
      const { accessToken, refreshToken } = response.data;
      
      authService.setTokens(accessToken, refreshToken);
      
      const payload = authService.decodeToken(accessToken);
      if (payload) {
        setUser({
          id: payload.id,
          username: payload.username,
          is_admin: payload.is_admin
        });

        // Redirecionar após login
        navigate("/"); 
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Erro desconhecido.";
      throw new Error(message);
    }
  };

  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;