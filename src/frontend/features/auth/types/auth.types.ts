export type UserRole = "Administrador" | "Vendedor";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponseData {
  user: IUser;
  token: string;
  expiresIn: string;
}

export interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}