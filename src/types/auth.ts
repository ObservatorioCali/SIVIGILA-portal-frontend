export interface User {
    id: number;
    codigo: string;
    role: UserRole;
    institucion: string;
  }
  
  export enum UserRole {
    SECRETARIA_SALUD = 'secretaria_salud',
    REFERENTE_SIVIGILA = 'referente_sivigila',
    UPGD_UI = 'upgd_ui',
  }
  
  export interface LoginRequest {
    codigo: string;
    password: string;
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