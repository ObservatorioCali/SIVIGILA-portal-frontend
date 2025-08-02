/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginRequest, AuthContextType } from '@/types/auth';
import { authService } from '@/services/auth.service';

// Declaración de tipo para reCAPTCHA global
declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void;
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = localStorage.getItem('sivigila_token');
      const storedUser = localStorage.getItem('sivigila_user');

      if (token && storedUser) {
        // Simplemente verificar que existen, sin validar con servidor
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error validating auth state:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      
      // Guardar token y usuario con las mismas claves que authService
      localStorage.setItem('sivigila_token', response.access_token);
      localStorage.setItem('sivigila_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('sivigila_token');
    localStorage.removeItem('sivigila_user');
    setUser(null);
    
    // Limpiar cualquier token de reCAPTCHA que pueda estar en memoria
    try {
      // @ts-ignore - Acceso directo al objeto global de reCAPTCHA si existe
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    } catch (error) {
      // Ignorar errores de reCAPTCHA
      console.debug('reCAPTCHA reset not available or failed:', error);
    }
    
    // Opcional: Forzar recarga de la página para resetear completamente el estado
    // window.location.href = '/';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};