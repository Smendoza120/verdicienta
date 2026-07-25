import { Document, Types } from "mongoose";

export type UserRole = "Administrador" | "Vendedor";

// Interfaz para la entidad de Usuario en la base de datos
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz limpia de respuesta de Usuario para el Frontend
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
}

// DTO para el registro de usuario
export interface RegisterUserDTO {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

// DTO para actualizar datos del usuario
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  isActive?: boolean;
}

// DTO para el inicio de sesión
export interface LoginUserDTO {
  email: string;
  password?: string;
}

// Estructura del payload dentro del Token JWT
export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}