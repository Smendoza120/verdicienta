import { NextRequest } from "next/server";
import { JWTPayload } from "./userInterface";

/**
 * Representa la respuesta exitosa del authGuard con los datos del usuario extraídos del JWT.
 */
export interface AuthenticatedUser {
  user: JWTPayload;
}

/**
 * Interfaz opcional si extiendes el NextRequest directamente.
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}