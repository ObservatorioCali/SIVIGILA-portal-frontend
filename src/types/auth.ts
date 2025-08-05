export interface User {
  id: number;
  codigo: string;
  cod_pre: string;
  cod_sub: string;
  role: UserRole;
  institucion: string;
}
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    UPGD_UI = 'UPGD_UI',
  }
  
  export interface LoginRequest {
    codigo: string;
    password: string;
    recaptchaToken: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    user: User;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
  }