import axios from 'axios';
import authService from './authService';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token às requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com tokens expirados
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Verificar se é um erro 401 (Unauthorized) e não é uma tentativa de refresh
    if (error.response.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('refresh-token')) {
      
      originalRequest._retry = true;
      
      try {
        // Tentar renovar o token
        const newToken = await authService.refreshAccessToken();
        
        if (newToken) {
          // Se conseguir um novo token, refazer a requisição original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          // Se não conseguir, redirecionar para login
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Em caso de erro, redirecionar para login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;