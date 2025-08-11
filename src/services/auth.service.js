import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class AuthService {
  baseURL = API_URL;

  async login(credentials) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('recaptcha')) {
        console.warn('reCAPTCHA fallido, intentando login simplificado...');
        return this.loginSimple(credentials);
      }
      throw new Error(
        error.response?.data?.message || 'Error en el inicio de sesión'
      );
    }
  }

  async loginSimple(credentials) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/login-simple`,
        {
          codigo: credentials.codigo,
          password: credentials.password
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error en el inicio de sesión'
      );
    }
  }

  async validateToken(token) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/validate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete axios.defaults.headers.common['Authorization'];
  }

  saveToken(token) {
    localStorage.setItem('sivigila_token', token);
  }

  getToken() {
    return localStorage.getItem('sivigila_token');
  }

  removeToken() {
    localStorage.removeItem('sivigila_token');
  }

  saveUser(user) {
    localStorage.setItem('sivigila_user', JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem('sivigila_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser() {
    localStorage.removeItem('sivigila_user');
  }
}

export const authService = new AuthService();
