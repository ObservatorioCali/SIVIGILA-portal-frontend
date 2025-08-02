import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutos timeout por defecto
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sivigila_token'); // Usar la misma clave que authService
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.warn('🔒 Token inválido o expirado, redirigiendo al login');
      localStorage.removeItem('sivigila_token'); // Usar la misma clave que authService
      localStorage.removeItem('sivigila_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
