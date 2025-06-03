// frontend/src/services/auth/authService.jsx
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

class AuthService {
  // Salvar tokens após login
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Obter access token
  getAccessToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  
  // Obter refresh token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }

  decodeToken(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Remover tokens (logout)
  clearTokens() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  
  // Renovar access token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }
      
      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }
      
      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken ?? this.getRefreshToken());

      return data.accessToken;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.clearTokens();
      return null;
    }
  }
  
  // Realizar logout
  async logout() {
    try {
      const token = this.getAccessToken();
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      this.clearTokens();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Limpar tokens mesmo em caso de erro
      this.clearTokens();
    }
  }
}

const authService = new AuthService();

export { authService };

export default authService;
