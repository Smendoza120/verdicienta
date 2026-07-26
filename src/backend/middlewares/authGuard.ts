import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../modules/auth/utils/jwtUtils";
import { UserRole } from "../modules/auth/interfaces/userInterface";
import { AuthenticatedUser } from "../modules/auth/interfaces/authMiddlewareInterface";


/**
 * Verifica que la petición contenga un token Bearer JWT válido y no expirado.
 */
export async function authGuard(
  request: NextRequest
): Promise<AuthenticatedUser | NextResponse> {
  // 1. Intentar obtener el token desde la cookie HttpOnly
  let token = request.cookies.get("verdicienta_token")?.value;

  // 2. Fallback: Si no está en la cookie, buscar en el header Authorization (Bearer token)
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // Si no se encuentra el token en ninguno de los dos lugares
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "Acceso denegado. No se proporcionó un token de autenticación.",
      },
      { status: 401 }
    );
  }

  // 3. Verificar y decodificar el JWT
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
export function roleGuard(
  userRole: UserRole,
  allowedRoles: UserRole[]
): NextResponse | null {
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      {
        success: false,
        error: `Acceso prohibido. El rol '${userRole}' no tiene permisos para realizar esta acción.`,
      },
      { status: 403 }
    );
  }

  return null;
}