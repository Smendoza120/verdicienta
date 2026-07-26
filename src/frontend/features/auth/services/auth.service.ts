import { ApiResponse, LoginCredentials, LoginResponseData, IUser } from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const authService = {
  /**
   * Petición de Inicio de Sesión
   */
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Envia y recibe cookies HttpOnly
      body: JSON.stringify(credentials),
    });

    const result: ApiResponse<LoginResponseData> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Ocurrió un error al intentar iniciar sesión.");
    }

    return result.data;
  },

  /**
   * Verifica la sesión activa y obtiene los datos del usuario actual
   */
  async getCurrentUser(): Promise<IUser> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result: ApiResponse<IUser> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Sesión no válida o expirada.");
    }

    return result.data;
  },

  /**
   * Cierra la sesión eliminando la cookie HttpOnly en el servidor
   */
  async logout(): Promise<void> {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  },
};