/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginRequest, LoginResponse, User } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  private baseURL = API_URL;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Temporal fix: Bypass reCAPTCHA usando login-simple - v2024.08.06
      const response = await axios.post<LoginResponse>(
        `${this.baseURL}/auth/login-simple`,
        { codigo: credentials.codigo, password: credentials.password }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error en el inicio de sesión'
      );
    }
  }

  async validateToken(token: string): Promise<{ user: User; valid: boolean }> {
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

  setAuthToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete axios.defaults.headers.common['Authorization'];
  }

  saveToken(token: string) {
    localStorage.setItem('sivigila_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('sivigila_token');
  }

  removeToken() {
    localStorage.removeItem('sivigila_token');
  }

  saveUser(user: User) {
    localStorage.setItem('sivigila_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('sivigila_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser() {
    localStorage.removeItem('sivigila_user');
  }
}

export const authService = new AuthService();