import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../modules/auth/utils/jwtUtils";
import { JWTPayload, UserRole } from "../modules/auth/interfaces/userInterface";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Verifica que la petición contenga un token Bearer JWT válido y no expirado.
 */
export async function authGuard(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        success: false,
        error: "Acceso denegado. No se proporcionó un token de autenticación.",
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        error: "Sesión expirada o token inválido. Por favor, inicia sesión nuevamente.",
      },
      { status: 401 }
    );
  }

  return { user: payload };
}

/**
 * Verifica si el usuario autenticado posee uno de los roles autorizados.
 */
export function roleGuard(userRole: UserRole, allowedRoles: UserRole[]): NextResponse | null {
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      {
        success: false,
        error: `Acceso prohibido. El rol '${userRole}' no tiene permisos para realizar esta acción.`,
      },
      { status: 403 }
    );
  }

  return null; // Null indica que el permiso fue concedido
}